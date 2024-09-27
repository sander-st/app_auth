import brevo from "@getbrevo/brevo";
import { EMAIL_TEMPLATES } from "./emailTemplate.js";
import { replaceTemplate } from "../../utils/FG.js";

const { API_KEY_BREVO, DOMINIO_MAIL } = process.env;

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  API_KEY_BREVO
);

export const sendEmail = async ({ email, subject, name, type, variables }) => {
  try {
    const sendSmptEmail = new brevo.SendSmtpEmail();

    const template = EMAIL_TEMPLATES[type];

    sendSmptEmail.subject = subject;
    sendSmptEmail.to = [{ email, name }];
    sendSmptEmail.htmlContent = replaceTemplate(template, variables);
    sendSmptEmail.sender = {
      name: "service auth",
      email: DOMINIO_MAIL,
    };

    return await apiInstance.sendTransacEmail(sendSmptEmail);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error(error.message);
  }
};

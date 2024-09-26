import brevo from "@getbrevo/brevo";
import { TEMPLATE_EMAIL_VERIFIED } from "./emailTemplate.js";

const { API_KEY_BREVO, DOMINIO_MAIL } = process.env;

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  API_KEY_BREVO
);

export const sendEmail = async (data) => {
  const { email, subject, name, verificationCode } = data;

  try {
    const sendSmptEmail = new brevo.SendSmtpEmail();

    sendSmptEmail.subject = subject;
    sendSmptEmail.to = [{ email, name }];
    sendSmptEmail.htmlContent = TEMPLATE_EMAIL_VERIFIED.replace(
      "{VERIFICATION_CODE}",
      verificationCode
    );
    sendSmptEmail.sender = {
      name: "service auth",
      email: DOMINIO_MAIL,
    };

    const result = await apiInstance.sendTransacEmail(sendSmptEmail);
    return result;
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error(error.message);
  }
};

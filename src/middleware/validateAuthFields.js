import {
  authLoginSchema,
  authRegisterSchema,
  authForgotPasswordSchema,
  authResetPasswordSchema,
} from "../models/schema.auth.js";

export const validateAuthFields = (req, res, next) => {
  const { body, path } = req;

  try {
    if (path === "/signup") {
      const data = authRegisterSchema.parse(body);
      req.dataUser = data;
      next();
    } else if (path === "/login") {
      const data = authLoginSchema.parse(body);
      req.dataUser = data;
      next();
    } else if (path === "/forgotpassword") {
      const data = authForgotPasswordSchema.parse(body);
      req.email = data.email;
      next();
    } else if (path === "/resetpassword") {
      const data = authResetPasswordSchema.parse(body);
      req.updatedPasswd = data.passwd;
      next();
    }
  } catch (error) {
    res.status(400).json({ error: JSON.parse(error.message) });
  }
};

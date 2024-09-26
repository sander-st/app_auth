import { authLoginSchema, authRegisterSchema } from "../models/schema.auth.js";

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
    }
  } catch (error) {
    res.status(400).json({ error: JSON.parse(error.message) });
  }
};

import jwt from "jsonwebtoken";

const { sign, verify } = jwt;
const { JWT_SECRET_KEY } = process.env;

export const generateToken = (data) => {
  return sign(data, JWT_SECRET_KEY, { expiresIn: "1h" });
};

export const validateToken = (token) => {
  return verify(token, JWT_SECRET_KEY);
};

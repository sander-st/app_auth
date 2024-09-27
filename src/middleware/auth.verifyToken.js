import { validateToken } from "../utils/jwt.js";

export const authVerifyToken = (req, res, next) => {
  const { __session } = req.cookies;
  if (!__session) {
    return res.status(404).json({ error: "Token not found" });
  }

  const payload = validateToken(__session);

  if (!payload) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.dataUser = payload;

  next();
};

import { authService } from "../service/index.js";

export const register = async (req, res) => {
  const { dataUser } = req;

  const { token, ...data } = await authService.register(dataUser);
  res.cookie("__session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 60 * 60 * 1000), // valido por una hora
  });
  res.json(data);
};

export const login = async (req, res) => {
  const { dataUser } = req;

  const { token, ...data } = await authService.login(dataUser);
  res.cookie("__session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 60 * 60 * 1000), // valido por una hora
  });
  res.json(data);
};

export const logout = (req, res) => {
  res.clearCookie("__session");
  res.json({
    message: "Logout successfully",
    succes: false,
  });
};

export const verifyUser = (req, res) => {
  const { dataUser } = req;
  const data = {
    userProfile: dataUser,
    succes: true,
    message: "User verified successfully",
  };
  res.json(data);
};

export const validateAuthCode = async (req, res) => {
  const { dataUser } = req;
  const { code } = req.body;
  const result = await authService.validateCode({ dataUser, code });
  res.json(result);
};

export const forgotPassword = async (req, res) => {
  const URL_HOST = `${req.protocol}://${req.get("host")}`;
  const { email } = req.body;
  const result = await authService.forgotPassword(email, URL_HOST);
  res.json(result);
};

export const resetPassword = async (req, res) => {
  const { updatedPasswd } = req;
  const { token } = req.query;
  const result = await authService.resetPassword(token, updatedPasswd);
  res.json(result);
};

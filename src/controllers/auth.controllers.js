import {
  userLogin,
  userRegister,
  validateCode,
  userForgotPassword,
  userResetPassword,
} from "../service/auth.service.js";

export const register = async (req, res) => {
  const { dataUser } = req;

  try {
    const { token, ...data } = await userRegister(dataUser);
    res.cookie("__session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 60 * 60 * 1000), // valido por una hora
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { dataUser } = req;

  try {
    const { token, ...data } = await userLogin(dataUser);
    res.cookie("__session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 60 * 60 * 1000), // valido por una hora
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
  try {
    const result = await validateCode({ dataUser, code });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const URL_HOST = `${req.protocol}://${req.get("host")}`;
    const { email } = req.body;
    const result = await userForgotPassword(email, URL_HOST);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { updatedPasswd } = req;
  const { token } = req.query;
  try {
    const result = await userResetPassword(token, updatedPasswd);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

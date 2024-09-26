import { userLogin, userRegister } from "../service/auth.service.js";

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

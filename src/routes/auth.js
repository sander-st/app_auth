import { Router } from "express";
import {
  login,
  register,
  logout,
  verifyUser,
} from "../controllers/auth.controllers.js";
import { validateAuthFields } from "../middleware/validateAuthFields.js";
import { authVerifyToken } from "../middleware/auth.verifyToken.js";

const router = Router();

router.post("/signup", validateAuthFields, register);

router.post("/login", validateAuthFields, login);

router.get("/logout", logout);

router.get("/autenticate", authVerifyToken, verifyUser);

export { router };

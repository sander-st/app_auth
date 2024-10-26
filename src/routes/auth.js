import { Router } from "express";
import {
  login,
  register,
  logout,
  verifyUser,
  validateAuthCode,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controllers.js";
import { validateAuthFields } from "../middleware/validateAuthFields.js";
import { authVerifyToken } from "../middleware/auth.verifyToken.js";
import { catchedAsync } from "../utils/catchedAsync.js";

const router = Router();

router.post("/signup", validateAuthFields, catchedAsync(register));

router.post("/login", validateAuthFields, catchedAsync(login));

router.get("/logout", logout);

router.get("/authenticate", authVerifyToken, catchedAsync(verifyUser));

router.patch("/validateuser", authVerifyToken, catchedAsync(validateAuthCode));

router.post(
  "/forgotpassword",
  validateAuthFields,
  catchedAsync(forgotPassword)
);

router.patch("/resetpassword", validateAuthFields, catchedAsync(resetPassword));

export { router };

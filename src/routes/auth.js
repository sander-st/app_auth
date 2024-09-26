import { Router } from "express";
import { login, register } from "../controllers/auth.controllers.js";
import { validateAuthFields } from "../middleware/validateAuthFields.js";

const router = Router();

router.post("/signup", validateAuthFields, register);

router.post("/login", validateAuthFields, login);

export { router };

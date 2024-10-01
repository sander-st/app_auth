import z from "zod";

export const authRegisterSchema = z.object({
  fullname: z
    .string({ required_error: "fullname is required" })
    .regex(/^[a-zA-Z\s]+$/, { message: "fullname must only contain letters" })
    .min(3, { message: "fullname must be at least 3 characters long" })
    .max(35, { message: "fullname must be at most 35 characters long" }),
  email: z
    .string({ required_error: "email is required" })
    .email({ message: "invalid email" }),
  passwd: z.string({ required_error: "passwdord is required" }).min(6, {
    message: "passwd must be at least 6 characters long",
  }),
});

export const authLoginSchema = authRegisterSchema.omit({ fullname: true });

export const authForgotPasswordSchema = authRegisterSchema.omit({
  fullname: true,
  passwd: true,
});

export const authResetPasswordSchema = authRegisterSchema.omit({
  fullname: true,
  email: true,
});

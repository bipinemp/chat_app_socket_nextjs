import { z } from "zod";

export const RegisterSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(1, { message: "Username is required" }),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Minimum of 8 characters are required" }),
  image: z.string().optional(),
});

export type TRegister = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password is required" }),
});

export type TLogin = z.infer<typeof LoginSchema>;

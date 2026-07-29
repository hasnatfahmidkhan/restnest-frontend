import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Infer the type directly from the schema to avoid duplication
export type TLoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.email("Invalid email address").min(1, "Email is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["TENANT", "LANDLORD"], {
      message: "Please select a role",
    }),
    profilePhoto: z.string().min(1, "Profile photo is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TRegisterInput = z.infer<typeof registerSchema>;

import { z } from "zod/v3";
import { detailedResponse } from "@/shared/schema";

export const OTP_LENGTH = 6;
export const PASSWORD_MIN = 8;

export const AuthSchema = {
  SIGN_IN: {
    INPUT: z.object({
      email: z.string().email("Enter a valid email"),
      password: z.string().min(PASSWORD_MIN, "Please enter your password"),
      rememberMe: z.string().default("false"),
    }),
    OUTPUT: detailedResponse(z.null()),
  },
  SIGN_UP: {
    INPUT: z.object({
      name: z.string().min(2, "Name is too short").trim(),
      email: z.string().email("Enter a valid email").trim(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&)"),
    }),
    OUTPUT: detailedResponse(
      z.object({
        token: z.string(),
      }),
    ),
  },
  OTP_VERIFICATION: {
    INPUT: z.object({
      otp: z.string().length(6),
      token: z.string(),
      tokenType: z.string(),
    }),
    OUTPUT: detailedResponse(
      z.object({
        token: z.string().nullable(),
      }),
    ),
  },
  RESEND_OTP: {
    INPUT: z.object({
      token: z.string(),
      tokenType: z.string(),
    }),
    OUTPUT: detailedResponse(z.null()),
  },
  FORGOT_PASSWORD: {
    INPUT: z.object({
      email: z.string().email("Enter a valid email").trim(),
    }),
    OUTPUT: detailedResponse(
      z.object({
        token: z.string(),
      }),
    ),
  },
  CHANGE_PASSWORD: {
    INPUT: z
      .object({
        token: z.string().nullable(),
        userId: z.string().nullable(),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number")
          .regex(/[@$!%*?&#]/, "Password must contain at least one special character (@$!%*?&)"),
        confirmPassword: z.string().nullable(),
        oldPassword: z.string().nullable(),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }),
    OUTPUT: detailedResponse(z.null()),
  },
};

export type SignUpInput = z.infer<typeof AuthSchema.SIGN_UP.INPUT>;
export type SignUPOutput = z.infer<typeof AuthSchema.SIGN_UP.OUTPUT>;
export type OtpVerificationInput = z.infer<typeof AuthSchema.OTP_VERIFICATION.INPUT>;
export type OtpVerificationOutput = z.infer<typeof AuthSchema.OTP_VERIFICATION.OUTPUT>;
export type ResendOtpInput = z.infer<typeof AuthSchema.RESEND_OTP.INPUT>;
export type ResendOtpOutput = z.infer<typeof AuthSchema.RESEND_OTP.OUTPUT>;
export type ForgotPasswordInput = z.infer<typeof AuthSchema.FORGOT_PASSWORD.INPUT>;
export type ForgotPasswordOutput = z.infer<typeof AuthSchema.FORGOT_PASSWORD.OUTPUT>;
export type ChangePasswordInput = z.infer<typeof AuthSchema.CHANGE_PASSWORD.INPUT>;
export type ChangePasswordOutput = z.infer<typeof AuthSchema.CHANGE_PASSWORD.OUTPUT>;

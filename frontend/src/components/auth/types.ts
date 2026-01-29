// src/components/auth/types.ts
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export type ResetStep = 1 | 2 | 3;

export interface ResetStepData {
  1: { email: string };
  2: { code: string };
  3: { newPassword: string; confirmPassword: string };
}
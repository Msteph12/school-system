import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPasswordForm";
import type { LoginCredentials, ResetStep, ResetStepData } from "./types";
import { authService } from "@/services/auth";
import { useAuth } from "@/context/useAuth";

const AdminLogin = () => {
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState<ResetStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  /* ===================== LOGIN ===================== */
  const handleLogin = async (credentials: LoginCredentials) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    try {
      const user = await authService.login(credentials);
      setUser(user);

      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "registrar":
          navigate("/registrar");
          break;
        default:
          navigate("/login");
      }
    } catch {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  /* ===================== RESET FLOW ===================== */
  const handleForgotPassword = () => {
    setIsResetMode(true);
    setResetStep(1);
    setError("");
    setSuccess("");
  };

  const handleBackToLogin = () => {
    setIsResetMode(false);
    setResetStep(1);
    setError("");
    setSuccess("");
  };

  const handleResetPassword = async (
    step: ResetStep,
    data: ResetStepData[ResetStep]
  ) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (step === 1 && "email" in data) {
        await handleSendResetCode(data.email);
      }

      if (step === 2 && "code" in data) {
        handleVerifyResetCode(data.code);
      }

      if (
        step === 3 &&
        "newPassword" in data &&
        "confirmPassword" in data
      ) {
        await handleSetNewPassword(data.newPassword, data.confirmPassword);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetCode = async (email: string) => {
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    try {
      await authService.forgotPassword(email);
      setSuccess("Password reset link sent to your email");
      setResetStep(2);
    } catch {
      setError("Failed to send reset link");
    }
  };

  const handleVerifyResetCode = (code: string) => {
    if (!code.trim()) {
      setError("Please enter the reset token");
      return;
    }

    setSuccess("Token accepted. Set a new password.");
    setResetStep(3);
  };

  const handleSetNewPassword = async (
    newPassword: string,
    confirmPassword: string
  ) => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await authService.resetPassword({
        email: "",
        token: "",
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setSuccess("Password reset successful. You can now login.");
      setTimeout(() => {
        setIsResetMode(false);
        setResetStep(1);
      }, 1500);
    } catch {
      setError("Invalid or expired reset token");
    }
  };

  /* ===================== UI ===================== */
  return (
    <AuthLayout>
      {isResetMode ? (
        <ResetPasswordForm
          onSubmit={handleResetPassword}
          onBack={handleBackToLogin}
          currentStep={resetStep}
          isLoading={isLoading}
          error={error}
          success={success}
          onStepChange={setResetStep}
        />
      ) : (
        <LoginForm
          onSubmit={handleLogin}
          onForgotPassword={handleForgotPassword}
          isLoading={isLoading}
          error={error}
          success={success}
        />
      )}
    </AuthLayout>
  );
};

export default AdminLogin;

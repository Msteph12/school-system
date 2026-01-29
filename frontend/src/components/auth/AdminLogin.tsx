// src/components/auth/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPasswordForm";
import type { LoginCredentials, ResetStep, ResetStepData } from "./types";

const AdminLogin = () => {
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetStep, setResetStep] = useState<ResetStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Handle login submission
  const handleLogin = async (credentials: LoginCredentials) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!credentials.email.trim() || !credentials.password.trim()) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    // Admin credentials check
    const adminCredentials = {
      email: "admin@stanthonys.academy",
      password: "admin123"
    };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === adminCredentials.email && 
          credentials.password === adminCredentials.password) {
        // Store login state
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("userRole", "admin");
        
        // Redirect to admin dashboard
        navigate("/admin");
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    setIsResetMode(true);
    setResetStep(1);
    setError("");
    setSuccess("");
  };

  // Handle back to login
  const handleBackToLogin = () => {
    setIsResetMode(false);
    setResetStep(1);
    setError("");
    setSuccess("");
  };

  // Handle reset password submission
  const handleResetPassword = async (step: ResetStep, data: ResetStepData[ResetStep]) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      switch (step) {
        case 1: // Send reset code
          // Type guard for step 1 data
          if ('email' in data) {
            await handleSendResetCode(data.email);
          }
          break;
        case 2: // Verify reset code
          // Type guard for step 2 data
          if ('code' in data) {
            await handleVerifyResetCode(data.code);
          }
          break;
        case 3: // Set new password
          // Type guard for step 3 data
          if ('newPassword' in data && 'confirmPassword' in data) {
            await handleSetNewPassword(data.newPassword, data.confirmPassword);
          }
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Send reset code
  const handleSendResetCode = async (email: string) => {
    if (!email.trim()) {
      setError("Please enter your admin email address");
      return;
    }

    // Check if it's the admin email
    if (email !== "admin@stanthonys.academy") {
      setError("This email is not registered as an admin");
      return;
    }

    // Simulate API call to send reset code
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, we'll generate a mock reset code
    const mockResetCode = "123456";
    localStorage.setItem("resetCode", mockResetCode);
    
    setSuccess(`Reset code sent to ${email}. Use code: ${mockResetCode} (Demo)`);
    setResetStep(2);
  };

  // Verify reset code
  const handleVerifyResetCode = async (code: string) => {
    if (!code.trim()) {
      setError("Please enter the reset code");
      return;
    }

    // Verify the reset code
    const storedCode = localStorage.getItem("resetCode");
    if (code !== storedCode) {
      setError("Invalid reset code. Please check your email.");
      return;
    }

    setSuccess("Code verified. Please set your new password.");
    setResetStep(3);
  };

  // Set new password
  const handleSetNewPassword = async (newPassword: string, confirmPassword: string) => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please enter and confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Simulate API call to reset password
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, you would update the password in your backend
    // For demo, we'll update the mock credentials
    localStorage.removeItem("resetCode");
    
    setSuccess("Password reset successfully! You can now login with your new password.");
    
    // Return to login after successful reset
    setTimeout(() => {
      setIsResetMode(false);
      setResetStep(1);
    }, 2000);
  };

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
        onStepChange={(step) => setResetStep(step)}
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
// src/components/auth/ResetPasswordForm.tsx
import React, { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, KeyRound } from "lucide-react";
import type { ResetStep } from "./types";

interface ResetStepData {
  1: { email: string };
  2: { code: string };
  3: { newPassword: string; confirmPassword: string };
}

interface ResetPasswordFormProps {
  onSubmit: (step: ResetStep, data: ResetStepData[ResetStep]) => Promise<void>;
  onBack: () => void;
  currentStep: ResetStep;
  isLoading: boolean;
  error?: string;
  success?: string;
  onStepChange?: (step: ResetStep) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  onBack,
  currentStep,
  isLoading,
  error,
  success,
  onStepChange
}) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    switch (currentStep) {
      case 1:
        await onSubmit(1, { email });
        break;
      case 2:
        await onSubmit(2, { code });
        break;
      case 3:
        await onSubmit(3, { newPassword, confirmPassword });
        break;
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBack(); // Go back to login
    } else {
      // Navigate to previous step in reset flow
      const previousStep = (currentStep - 1) as ResetStep;
      if (onStepChange) {
        onStepChange(previousStep);
      }
    }
  };

  const handleBackToEmail = () => {
    if (onStepChange) {
      onStepChange(1);
    }
  };

  const handleBackToCode = () => {
    if (onStepChange) {
      onStepChange(2);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Enter your admin email to receive a reset code";
      case 2: return "Enter the 6-digit code sent to your email";
      case 3: return "Set your new password";
      default: return "";
    }
  };

  const getBackButtonLabel = () => {
    if (currentStep === 1) {
      return "Back to login";
    }
    return "Back";
  };

  return (
    <div className="backdrop-blur-xl bg-white/95 border border-white/30 rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 text-center border-b border-gray-200/30 relative">
        <button
          onClick={handleBack}
          className="absolute left-6 top-6 text-gray-600 hover:text-gray-800 transition-colors"
          aria-label={getBackButtonLabel()}
          title={getBackButtonLabel()}
          disabled={isLoading}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center border-2 border-amber-400/30 overflow-hidden">
            <KeyRound className="w-8 h-8 text-amber-600" />
          </div>
          
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Reset Password
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {getStepTitle()}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm text-center">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Step 1: Email Input */}
          {currentStep === 1 && (
            <>
              <div className="space-y-1">
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  Admin Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                    placeholder="admin@stanthonys.academy"
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  A reset code will be sent to this email address.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-2" />
                    Sending Code...
                  </div>
                ) : (
                  "Send Reset Code"
                )}
              </button>
            </>
          )}

          {/* Step 2: Code Input */}
          {currentStep === 2 && (
            <>
              <div className="space-y-1">
                <label htmlFor="reset-code" className="block text-sm font-medium text-gray-700">
                  6-Digit Reset Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="reset-code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 text-center tracking-widest text-lg"
                    placeholder="123456"
                    maxLength={6}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Check your email for the 6-digit code. Demo code: 123456
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-2" />
                    Verifying...
                  </div>
                ) : (
                  "Verify Code"
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToEmail}
                className="w-full py-2.5 px-4 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200"
                disabled={isLoading}
              >
                Back to Email
              </button>
            </>
          )}

          {/* Step 3: New Password */}
          {currentStep === 3 && (
            <>
              <div className="space-y-1">
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                    placeholder="Enter new password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm new password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    title={showPassword ? "Hide password" : "Show password"}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-700 font-medium mb-1">
                  Password Requirements:
                </p>
                <ul className="text-xs text-blue-700 space-y-0.5">
                  <li>• At least 6 characters long</li>
                  <li>• Should include letters and numbers</li>
                  <li>• Avoid using common passwords</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-2" />
                    Resetting Password...
                  </div>
                ) : (
                  "Reset Password"
                )}
              </button>

              <button
                type="button"
                onClick={handleBackToCode}
                className="w-full py-2.5 px-4 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200"
                disabled={isLoading}
              >
                Back to Code Verification
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
// src/components/auth/AuthLayout.tsx
import React from "react";
import loginBg from "@/assets/login-bg.jpg";

interface AuthLayoutProps {
  children: React.ReactNode;
  showBackground?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  showBackground = true 
}) => {
  return (
    <div 
      className="h-screen relative flex items-center justify-center p-4 overflow-hidden bg-cover bg-center bg-no-repeat" 
      style={showBackground ? { backgroundImage: `url(${loginBg})` } : {}}
    >
      {showBackground && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800/40 to-purple-800/30 backdrop-blur-[1px]" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-gray-500/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-600/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </>
      )}
      
      <div className="relative z-10 w-full max-w-md py-12">
        {children}
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} St. Anthony&apos;s Academy
          </p>
          <p className="text-xs text-gray-400/70 mt-1">
            Secure Admin Portal v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

import { AuthProvider } from "@/context/AuthProvider";
import { SystemProvider } from "@/context/SystemProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SystemProvider>
          <App />
        </SystemProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

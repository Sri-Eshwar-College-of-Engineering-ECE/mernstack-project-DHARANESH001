import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/globals.css";
import "./styles/animations.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
      position="top-right"
      gutter={12}
      toastOptions={{
        duration: 3000,
        style: {
          background: "#1e293b",
          color: "#f1f5f9",
          border: "1px solid rgba(148, 163, 184, 0.15)",
          borderRadius: "12px",
          fontSize: "14px",
          fontFamily: "Inter, sans-serif",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        },
        success: { iconTheme: { primary: "#22c55e", secondary: "#1e293b" } },
        error: { iconTheme: { primary: "#ef4444", secondary: "#1e293b" } },
      }}
    />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

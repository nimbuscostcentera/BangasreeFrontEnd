import React from "react";
import AuthAppBar from "../../Pages/AppBar/authAppBar";
export default function AuthLayoutWrapper({ children }) {
  return (
    <div>
      <AuthAppBar />
      {children}
    </div>
  );
}

import React from "react";
import AuthLayout from "../../Components/auth/AuthLayout";
import LoginForm from "../../Components/auth/LoginForm";

export default function Login() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

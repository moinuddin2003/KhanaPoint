import React from "react";
import AuthLayout from "../../Components/auth/AuthLayout";
import SignupForm from "../../Components/auth/SignupForm";

export default function Signup() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}

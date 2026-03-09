import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-muted">Sign in to manage your events</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

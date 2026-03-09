import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Create Account" };

export default function SignupPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-white">
          Join Berlin Blockchain Events
        </h1>
        <p className="mt-1 text-sm text-muted">
          Post events and connect with the ecosystem
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8">
        <SignupForm />
      </div>
    </div>
  );
}

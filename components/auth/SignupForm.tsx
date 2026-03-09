"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { SignupFormData } from "@/types";

export default function SignupForm() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const [form, setForm] = useState<SignupFormData>({
    first_name: "",
    last_name: "",
    company: "",
    email: "",
    password: "",
    notification_opt_in: false,
    gdpr_consent: false,
  });

  const set = (key: keyof SignupFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.gdpr_consent) {
      setError("You must accept the privacy policy to create an account.");
      return;
    }
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          company: form.company,
          notification_opt_in: form.notification_opt_in,
          gdpr_consent: true,
          gdpr_consent_date: new Date().toISOString(),
        },
      },
    });

    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }

    // Email confirmation required (session is null until verified)
    if (data.user && !data.session) {
      setSubmittedEmail(form.email);
      setEmailSent(true);
      return;
    }

    // Confirmed immediately (email confirmation disabled in Supabase)
    window.location.href = "/events";
  };

  const handleGoogle = async () => {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
      },
    });
    if (oauthError) {
      setError(
        "Google sign-in is currently unavailable. Please use email/password or check that Google OAuth is enabled in your Supabase project.",
      );
    }
  };

  if (emailSent) {
    return (
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
          ✉️
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Check your email</h2>
          <p className="mt-1.5 text-sm text-muted">
            We sent a confirmation link to{" "}
            <span className="font-medium text-white">{submittedEmail}</span>.
            Click it to activate your account.
          </p>
        </div>
        <p className="text-xs text-muted">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            type="button"
            className="text-accent hover:underline"
            onClick={async () => {
              await supabase.auth.resend({
                type: "signup",
                email: submittedEmail,
              });
              setError("");
            }}
          >
            resend the email
          </button>
          .
        </p>
        <Link href="/login" className="text-sm text-accent hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Button type="button" variant="secondary" onClick={handleGoogle}>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="First Name"
          required
          placeholder="Ada"
          value={form.first_name}
          onChange={(e) => set("first_name", e.target.value)}
        />
        <Input
          label="Last Name"
          required
          placeholder="Lovelace"
          value={form.last_name}
          onChange={(e) => set("last_name", e.target.value)}
        />
      </div>

      <Input
        label="Company"
        placeholder="Your organisation (optional)"
        value={form.company}
        onChange={(e) => set("company", e.target.value)}
      />

      <Input
        label="Email"
        type="email"
        required
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        required
        placeholder="Min. 8 characters"
        minLength={8}
        value={form.password}
        onChange={(e) => set("password", e.target.value)}
      />

      {/* Notifications opt-in */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-border bg-surface accent-accent"
          checked={form.notification_opt_in}
          onChange={(e) => set("notification_opt_in", e.target.checked)}
        />
        <span className="text-sm text-muted">
          Notify me by email when new events are posted.
        </span>
      </label>

      {/* GDPR consent – required */}
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 rounded border-border bg-surface accent-accent"
          checked={form.gdpr_consent}
          onChange={(e) => set("gdpr_consent", e.target.checked)}
        />
        <span className="text-sm text-muted">
          I have read and accept the{" "}
          <Link
            href="/privacy"
            className="text-accent underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>{" "}
          and consent to the processing of my personal data.{" "}
          <span className="text-red-400">*</span>
        </span>
      </label>

      <Button type="submit" size="lg" loading={loading} className="mt-1">
        Create Account
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

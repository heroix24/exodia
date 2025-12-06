"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Eye, EyeOff, Github } from "lucide-react";

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M19.6 10.23c0-.68-.06-1.35-.18-2H10v3.78h5.36c-.23 1.2-.93 2.22-1.98 2.9v2.4h3.2c1.87-1.73 2.98-4.28 2.98-7.08Z"
      fill="#4285F4"
    />
    <path
      d="M10 20c2.7 0 4.96-.88 6.62-2.39l-3.2-2.4c-.9.6-2.06.95-3.42.95-2.63 0-4.86-1.78-5.66-4.17H1.06v2.52C2.7 17.98 6.07 20 10 20Z"
      fill="#34A853"
    />
    <path
      d="M4.34 11.99a6.002 6.002 0 0 1 0-3.97V5.5H1.06a9.997 9.997 0 0 0 0 9l3.28-2.51Z"
      fill="#FBBC05"
    />
    <path
      d="M10 3.96c1.47-.02 2.88.53 3.95 1.52l2.95-2.95C15 1.04 12.6 0 10 0 6.07 0 2.7 2.02 1.06 5.5l3.28 2.52C5.14 5.74 7.37 3.96 10 3.96Z"
      fill="#EA4335"
    />
  </svg>
);

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api/v1";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok || json.status !== "success") {
        throw new Error(json?.message || "Unable to sign in");
      }

      const { token, user } = json.data ?? {};

      if (token) {
        localStorage.setItem("exodia_token", token);
      }
      if (user) {
        localStorage.setItem("exodia_user", JSON.stringify(user));
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr] bg-[#f6ede2] text-[#1a5f3c]">
      <div className="relative hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <Link
          href="/"
          className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-md bg-[#1d6b43] px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-[#155533]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="text-3xl font-semibold text-[#1b5f3b]">
              Welcome back
            </h1>
            <p className="text-sm text-[#1a3d2e]/70">
              Sign in to your account to continue your journey with FlowT
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-11 justify-center gap-2 border border-[#1a5f3c] bg-transparent text-[#1a5f3c] hover:bg-[#1a5f3c]/5"
            >
              <Github className="h-5 w-5" />
              Sign in with GitHub
            </Button>
            <Button
              variant="outline"
              className="h-11 justify-center gap-2 border border-[#1a5f3c] bg-transparent text-[#1a5f3c] hover:bg-[#1a5f3c]/5"
            >
              <GoogleIcon />
              Sign in with Google
            </Button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a3d2e]">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-11 border border-[#1a5f3c] bg-transparent text-[#1a3d2e] placeholder:text-[#1a3d2e]/60 focus-visible:ring-[#1a5f3c]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <label className="font-medium text-[#1a3d2e]">Password</label>
                <Link href="#" className="text-[#1a5f3c] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="......"
                  required
                  minLength={8}
                  className="h-11 border border-[#1a5f3c] bg-transparent text-[#1a3d2e] placeholder:text-[#1a3d2e]/60 focus-visible:ring-[#1a5f3c]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-[#1a3d2e]/70 hover:text-[#1a5f3c]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-sm text-red-600"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-[#1a5f3c] text-white hover:bg-[#154a2f] disabled:opacity-80"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#1a3d2e]/70">
            Don&apos;t have an account?{" "}
            <Link
              href="/register-page"
              className="font-medium text-[#1a5f3c] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

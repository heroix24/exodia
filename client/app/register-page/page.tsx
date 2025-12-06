"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr] bg-[#f6ede2] text-[#1a5f3c]">
      <div className="relative hidden lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80')",
            filter: "grayscale(100%) contrast(1.05)",
          }}
        />
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <Link
          href="/landing-page"
          className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-md bg-[#1d6b43] px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-[#155533]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl space-y-10">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-semibold text-[#1b5f3b]">Create your account</h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              variant="outline"
              className="h-11 justify-center gap-2 border border-[#1a5f3c] bg-transparent text-[#1a5f3c] hover:bg-[#1a5f3c]/5"
            >
              <Github className="h-5 w-5" />
              Sign up with GitHub
            </Button>
            <Button
              variant="outline"
              className="h-11 justify-center gap-2 border border-[#1a5f3c] bg-transparent text-[#1a5f3c] hover:bg-[#1a5f3c]/5"
            >
              <GoogleIcon />
              Sign up with Google
            </Button>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a3d2e]">Full Name</label>
              <Input
                type="text"
                placeholder="Enter your name"
                className="h-11 border border-[#1a5f3c] bg-transparent text-[#1a3d2e] placeholder:text-[#1a3d2e]/60 focus-visible:ring-[#1a5f3c]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1a3d2e]">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-11 border border-[#1a5f3c] bg-transparent text-[#1a3d2e] placeholder:text-[#1a3d2e]/60 focus-visible:ring-[#1a5f3c]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1a3d2e]">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="......"
                    className="h-11 border border-[#1a5f3c] bg-transparent text-[#1a3d2e] placeholder:text-[#1a3d2e]/60 focus-visible:ring-[#1a5f3c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-[#1a3d2e]/70 hover:text-[#1a5f3c]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1a3d2e]">Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="......"
                    className="h-11 border border-[#1a5f3c] bg-transparent text-[#1a3d2e] placeholder:text-[#1a3d2e]/60 focus-visible:ring-[#1a5f3c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-[#1a3d2e]/70 hover:text-[#1a5f3c]"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button className="h-11 w-full bg-[#1a5f3c] text-white hover:bg-[#154a2f]">
              Sign in
            </Button>
          </div>

          <p className="text-center text-sm text-[#1a3d2e]/70">
            Already have an account?{" "}
            <Link href="/login-page" className="font-medium text-[#1a5f3c] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


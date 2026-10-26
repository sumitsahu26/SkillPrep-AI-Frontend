"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Loader2 } from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";

import { apiRequest, ApiResponse } from "../../lib/app";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest<ApiResponse>("/auth/register", {
        method: "POST",

        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      setSuccess(response.message || "Registration successful");

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  //  GOOGLE LOGIN

  const handleGoogleRegister = async (credential?: string) => {
    try {
      setError("");
      setSuccess("");

      if (!credential) {
        setError("Google credential was not returned");
        return;
      }

      setLoading(true);

      const response = await apiRequest<ApiResponse>("/auth/google", {
        method: "POST",
        body: JSON.stringify({
          credential,
        }),
      });

      if (!response.accessToken) {
        throw new Error("Access token was not returned");
      }

      saveLoginData(response);

      setSuccess(response.message || "Google registration successful");

      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Google registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  //  SAVE AUTH DATA

  const saveLoginData = (response: ApiResponse) => {
    if (response.accessToken) {
      localStorage.setItem("accessToken", response.accessToken);
    }

    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-500/30">
            <UserPlus className="h-7 w-7 text-violet-400" />
          </div>

          <h1 className="text-3xl font-bold">Create Account</h1>

          <p className="mt-2 text-sm text-zinc-400">
            Start building your career with SkillPrep AI
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* ===============================
              DIVIDER
          =============================== */}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-800" />

            <span className="text-xs uppercase text-zinc-500">
              Or continue with
            </span>

            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          {/* ===============================
              GOOGLE LOGIN
          =============================== */}

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleGoogleRegister(credentialResponse.credential);
              }}
              onError={() => {
                setError("Google registration failed. Please try again.");
              }}
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
              width="380"
            />
          </div>

          {/* Login */}
          <div className="mt-6 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-violet-400 hover:text-violet-300"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

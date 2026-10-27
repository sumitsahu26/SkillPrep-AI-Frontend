"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";

import { apiRequest, ApiResponse } from "../../lib/app";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  //  NORMAL LOGIN

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest<ApiResponse>("/auth/login", {
        method: "POST",

        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.accessToken) {
        throw new Error("Access token was not returned");
      }

      saveLoginData(response);

      toast.success("Login Successfully");

      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  //  GOOGLE LOGIN

  const handleGoogleLogin = async (credential?: string) => {
    try {
      toast.error("");

      if (!credential) {
        toast.error("Google credential was not returned");
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

      router.push("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Google login failed");
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
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-600/20">
            <LogIn className="h-7 w-7 text-violet-400" />
          </div>

          <h1 className="text-3xl font-bold">Welcome Back</h1>

          <p className="mt-2 text-sm text-zinc-400">
            Login to continue with SkillPrep AI
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          {/* ===============================
              EMAIL LOGIN
          =============================== */}

          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-violet-400 transition hover:text-violet-300"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
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
                handleGoogleLogin(credentialResponse.credential);
              }}
              onError={() => {
                toast.error("Google login failed. Please try again.");
              }}
              theme="filled_black"
              shape="pill"
              size="large"
              text="continue_with"
              width="380"
            />
          </div>

          {/* ===============================
              REGISTER
          =============================== */}

          <div className="mt-6 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-violet-400 hover:text-violet-300"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

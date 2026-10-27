"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";

import Link from "next/link";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";

import { resetPassword } from "@/services/authApi";
import { toast } from "sonner";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");

  const [confirmPassword , setConfirmPassword] = useState("");

  const [showPassword,setShowPassword] = useState(false);

  const [showConfirmPassword,setShowConfirmPassword,] = useState(false);

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSuccess("")

    if (!token) {
      toast.error(
        "Reset password link is invalid"
      );
      return;
    }

    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await resetPassword(
          token,
          password
        );

      setSuccess(
        response.message ||
          "Password reset successfully"
      );

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 text-center shadow-2xl">
          <ShieldCheck className="mx-auto h-10 w-10 text-red-400" />

          <h1 className="mt-4 text-xl font-bold">
            Invalid Reset Link
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            This password reset link is
            invalid.
          </p>

          <Link
            href="/forgot-password"
            className="mt-6 inline-block rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition hover:bg-violet-500"
          >
            Request New Link
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-600/20">
            <Lock className="h-7 w-7 text-violet-400" />
          </div>

          <h1 className="text-3xl font-bold">
            Reset Password
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Create a new password for your
            SkillPrep AI account.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-2xl">
          {!success ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  New Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Minimum 6 characters"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter password again"
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-11 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-zinc-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-400" />
              </div>

              <h2 className="text-lg font-semibold">
                Password Reset
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                {success}
              </p>

              <p className="mt-2 text-xs text-zinc-500">
                Redirecting you to login...
              </p>
            </div>
          )}

          <div className="mt-6 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-400">
            Remember your password?{" "}
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

function ResetPasswordLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
      <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<ResetPasswordLoading />}
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
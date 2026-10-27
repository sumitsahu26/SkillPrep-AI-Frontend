"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { updateUser } from "@/services/profileApi";
import { toast } from "sonner";

export default function DangerZone() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const closeModal = () => {
    if (deleting) return;

    setShowConfirm(false);
    setConfirmText("");
  };

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm.");
      return;
    }

    try {
      setDeleting(true);


      await updateUser({
        isDeleted: true,
      });

      // Clear local authentication data
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Close modal
      setShowConfirm(false);
      setConfirmText("");

      // Redirect to login
      window.location.href = "/login";
    } catch (err) {
      console.error("Delete account error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete account."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-red-200 bg-white dark:border-red-500/20 dark:bg-[#101117]">
        <div className="border-b border-red-200 p-6 dark:border-red-500/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <AlertTriangle size={19} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Danger Zone
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Actions here can permanently affect your account.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-500/15 dark:bg-red-500/[0.04]">
            <h3 className="text-sm font-semibold text-red-700 dark:text-red-300">
              Delete account
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-red-600/80 dark:text-red-300/60">
              Permanently delete your SkillPrep AI account and associated data.
              This action cannot be undone.
            </p>

            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="mt-5 flex items-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:bg-red-500/5 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              <Trash2 size={16} />
              Delete account
            </button>
          </div>
        </div>
      </section>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm dark:bg-black/70">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/[0.08] dark:bg-[#101117]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Delete your account?
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  This will permanently delete your account and your SkillPrep AI
                  data. This action cannot be undone.
                </p>
              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={closeModal}
                className="text-zinc-400 transition hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-600 dark:hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Type DELETE to confirm
              </label>

              <input
                type="text"
                value={confirmText}
                disabled={deleting}
                onChange={(e) => {
                  setConfirmText(e.target.value);
            
                }}
                placeholder="DELETE"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-red-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#090d17] dark:text-white dark:placeholder:text-zinc-600 dark:focus:border-red-500"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={closeModal}
                className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/[0.04]"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting || confirmText !== "DELETE"}
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Trash2 size={16} />
                {deleting ? "Deleting..." : "Delete account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
} from "lucide-react";

import Sidebar from "@/app/components/Sidebar";
import Topbar from "@/app/components/Topbar";
import AuthGuard from "@/app/components/AuthGuard";

import {
  getResumes,
  deleteResume,
  type BackendResume,
} from "@/services/resumeApi";

export default function ResumesPage() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumes, setResumes] = useState<BackendResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getResumes();

      if (response.success) {
        setResumes(response.resumes || []);
      }
    } catch (error) {
      console.error("Failed to load resumes:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load resumes"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const handleCreateResume = () => {
    localStorage.removeItem("skillprep-resume-id");
    localStorage.removeItem("skillprep-resume-draft");
  
    router.push("/resume-builder");
  };

  const handleEditResume = (id: string) => {
    router.push(`/resume-builder?id=${id}`);
  };

  const handleDeleteResume = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const response = await deleteResume(id);

      if (response.success) {
        setResumes((prev) =>
          prev.filter((resume) => resume._id !== id)
        );

        const currentResumeId =
          localStorage.getItem("skillprep-resume-id");

        if (currentResumeId === id) {
          localStorage.removeItem("skillprep-resume-id");
          localStorage.removeItem("skillprep-resume-draft");
        }
      }
    } catch (error) {
      console.error("Delete resume error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete resume"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#08090d] text-zinc-100">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-5 pt-24 sm:p-8 sm:pt-24">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-violet-400">
                  Resume Builder
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  My Resumes
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                  Manage all your resumes from one place.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCreateResume}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
              >
                <Plus size={18} />
                Create New Resume
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Loading */}
            {isLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-zinc-500">
                  <Loader2
                    size={20}
                    className="animate-spin"
                  />
                  Loading resumes...
                </div>
              </div>
            ) : resumes.length === 0 ? (
              /* Empty State */
              <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
                  <FileText size={30} />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  No resumes yet
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Create your first resume and start building
                  your professional profile.
                </p>

                <button
                  type="button"
                  onClick={handleCreateResume}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  <Plus size={18} />
                  Create Your First Resume
                </button>
              </div>
            ) : (
              /* Resume Grid */
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-violet-500/30 hover:bg-white/[0.05]"
                  >
                    {/* Icon */}
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                        <FileText size={21} />
                      </div>

                      <span className="rounded-lg bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-400">
                        Saved
                      </span>
                    </div>

                    {/* Resume info */}
                    <h2 className="mt-5 truncate text-lg font-semibold">
                      {resume.title || "Untitled Resume"}
                    </h2>

                    <p className="mt-1 truncate text-sm text-zinc-500">
                      {resume.personalInfo?.fullName ||
                        "No name added"}
                    </p>

                    {resume.updatedAt && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
                        <Calendar size={14} />

                        Updated{" "}
                        {new Date(
                          resume.updatedAt
                        ).toLocaleDateString()}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          resume._id &&
                          handleEditResume(resume._id)
                        }
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/5"
                      >
                        <Pencil size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        disabled={deletingId === resume._id}
                        onClick={() =>
                          resume._id &&
                          handleDeleteResume(resume._id)
                        }
                        className="flex items-center justify-center rounded-xl border border-red-400/10 px-3 py-2.5 text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === resume._id ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
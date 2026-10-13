"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  BrainCircuit,
  Trophy,
  Clock3,
  ArrowRight,
  Plus,
  FileUser,
  Code2,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ProgressCard from "../components/ProgressCard";
import AuthGuard from "../components/AuthGuard";

const recentResumes = [
  {
    title: "MERN Stack Developer",
    updated: "Sample resume",
    status: "Draft",
    icon: FileUser,
  },
  {
    title: "Full Stack Developer",
    updated: "Sample resume",
    status: "Draft",
    icon: BriefcaseBusiness,
  },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
  <AuthGuard> 
    <div className="min-h-screen bg-[#08090d] text-zinc-100">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
          {/* Welcome */}
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-violet-400">
                Saturday, October 10, 2026
              </p>

              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                Welcome back! <span aria-hidden="true">👋</span>
              </h1>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Build your resume, sharpen your skills, and prepare for your
                next opportunity.
              </p>
            </div>

            <Link
              href="/resume-builder"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
            >
              <Plus size={18} />
              Create resume
            </Link>
          </section>

          {/* Statistics */}
          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="My resumes"
              value="02"
              description="Sample dashboard data"
              icon={FileText}
              color="text-violet-300"
              background="bg-violet-500/10"
            />

            <StatCard
              title="Topics explored"
              value="12"
              description="Sample dashboard data"
              icon={BrainCircuit}
              color="text-cyan-300"
              background="bg-cyan-500/10"
            />

            <StatCard
              title="Quizzes completed"
              value="08"
              description="Sample dashboard data"
              icon={Trophy}
              color="text-amber-300"
              background="bg-amber-500/10"
            />

            <StatCard
              title="Practice time"
              value="04h"
              description="Sample dashboard data"
              icon={Clock3}
              color="text-emerald-300"
              background="bg-emerald-500/10"
            />
          </section>

          {/* Main content */}
          <section className="mt-8 grid items-start gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              {/* Quick actions */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5 sm:p-6">
                <div>
                  <h2 className="text-lg font-semibold">
                    Quick actions
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    What would you like to work on today?
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Link
                    href="/resume-builder"
                    className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-violet-400/30 hover:bg-violet-500/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <FileText
                        size={22}
                        className="text-violet-300"
                      />
                      <ArrowRight
                        size={16}
                        className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-violet-300"
                      />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">
                      Build a resume
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Create and customize your professional resume.
                    </p>
                  </Link>

                  <Link
                    href="/interview-prep"
                    className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-cyan-400/30 hover:bg-cyan-500/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <BrainCircuit
                        size={22}
                        className="text-cyan-300"
                      />
                      <ArrowRight
                        size={16}
                        className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-cyan-300"
                      />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">
                      Practice interviews
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Explore technical questions and explanations.
                    </p>
                  </Link>

                  <Link
                    href="/mock-interview"
                    className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-emerald-400/30 hover:bg-emerald-500/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <Sparkles
                        size={22}
                        className="text-emerald-300"
                      />
                      <ArrowRight
                        size={16}
                        className="text-zinc-600 transition group-hover:translate-x-1"
                      />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">
                      AI mock interview
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Practice questions and review feedback.
                    </p>
                  </Link>

                  <Link
                    href="/roadmap"
                    className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-amber-400/30 hover:bg-amber-500/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <Code2 size={22} className="text-amber-300" />
                      <ArrowRight
                        size={16}
                        className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-amber-300"
                      />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold">
                      Learning roadmap
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Follow your technology learning path.
                    </p>
                  </Link>
                </div>
              </div>

              {/* Recent resumes */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Recent resumes
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">
                      Your recent resume projects
                    </p>
                  </div>

                  <Link
                    href="/resume-builder"
                    className="text-sm text-violet-300 hover:text-violet-200"
                  >
                    View all
                  </Link>
                </div>

                <div className="mt-5 space-y-3">
                  {recentResumes.map((resume) => {
                    const Icon = resume.icon;

                    return (
                      <div
                        key={resume.title}
                        className="flex items-center gap-3 rounded-xl border border-white/[0.06] p-3 sm:p-4"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                          <Icon
                            size={21}
                            className="text-violet-300"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {resume.title}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {resume.updated}
                          </p>
                        </div>

                        <span className="rounded-md border border-amber-400/15 bg-amber-400/[0.06] px-2 py-1 text-xs text-amber-300">
                          {resume.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Learning progress */}
            <ProgressCard />
          </section>

          <footer className="mt-10 border-t border-white/[0.07] py-6 text-center text-xs text-zinc-600">
            SkillPrep AI · Your career preparation workspace
          </footer>
        </main>
      </div>
    </div>
  </AuthGuard>
  );
}
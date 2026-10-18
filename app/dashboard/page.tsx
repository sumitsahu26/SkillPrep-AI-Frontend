"use client";

import {
  useEffect,
  useState,
  type ElementType,
} from "react";

import Link from "next/link";

import {
  ArrowRight,
  Bookmark,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  FileText,
  FileUser,
  Loader2,
  Map,
  MessageSquare,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";

import {
  getDashboard,
  type DashboardActivity,
  type DashboardData,
} from "@/services/dashboardApi";

/* =========================================================
   PAGE
========================================================= */

export default function DashboardPage() {
  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    dashboard,
    setDashboard,
  ] =
    useState<DashboardData | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* =====================================================
     LOAD
  ===================================================== */

  const loadDashboard =
    async () => {
      try {
        setIsLoading(true);

        setError("");

        const response =
          await getDashboard();

        setDashboard(
          response.dashboard
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard"
        );
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =====================================================
     DATE
  ===================================================== */
  const [today, setToday] = useState("");

  useEffect(() => {
    const formattedDate =
      new Intl.DateTimeFormat(
        "en-IN",
        {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      ).format(new Date());
  
    setToday(formattedDate);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#08090d] text-zinc-100">
        <Sidebar
          open={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <div className="min-h-screen lg:pl-64">
          <Topbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          <main className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">

            {/* HEADER */}

            <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-violet-400">
                  {today}
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                  Welcome back!{" "}
                  <span aria-hidden>
                    👋
                  </span>
                </h1>

                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Build your resume, sharpen your skills, and prepare for your next opportunity.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={
                    loadDashboard
                  }
                  disabled={
                    isLoading
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-zinc-400 transition hover:bg-white/[0.04]"
                >
                  <RefreshCw
                    size={16}
                    className={
                      isLoading
                        ? "animate-spin"
                        : ""
                    }
                  />

                  Refresh
                </button>

                <Link
                  href="/resume-builder"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
                >
                  <Plus
                    size={18}
                  />

                  Create resume
                </Link>
              </div>
            </section>

            {error && (
              <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* LOADING */}

            {isLoading &&
            !dashboard ? (
              <div className="flex min-h-[500px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-violet-300" />
              </div>
            ) : dashboard ? (
              <>
                {/* STATISTICS */}

                <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <DashboardStatCard
                    title="My resumes"
                    value={
                      dashboard.stats
                        .resumes
                    }
                    description="Created resumes"
                    icon={
                      FileText
                    }
                  />

                  <DashboardStatCard
                    title="Interview completed"
                    value={
                      dashboard.stats
                        .interviewCompleted
                    }
                    description="Questions completed"
                    icon={
                      BrainCircuit
                    }
                  />

                  <DashboardStatCard
                    title="Assessments"
                    value={
                      dashboard.stats
                        .assessmentsCompleted
                    }
                    description="Skill assessments completed"
                    icon={
                      Trophy
                    }
                  />

                  <DashboardStatCard
                    title="Mock interviews"
                    value={
                      dashboard.stats
                        .mockInterviewsCompleted
                    }
                    description="Completed interviews"
                    icon={
                      MessageSquare
                    }
                  />
                </section>

                {/* READINESS + INTERVIEW */}

                <section className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">

                  {/* CAREER READINESS */}

                  <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp
                        size={19}
                        className="text-violet-300"
                      />

                      <h2 className="font-semibold">
                        Career readiness
                      </h2>
                    </div>

                    <div className="mt-6 flex items-center gap-6">
                      <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-[9px] border-violet-500/20">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-violet-300">
                            {
                              dashboard
                                .careerReadiness
                                .score
                            }
                            %
                          </p>

                          <p className="text-[10px] text-zinc-500">
                            Overall
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 space-y-3">
                        <MiniProgress
                          label="Interview"
                          value={
                            dashboard
                              .careerReadiness
                              .interview
                          }
                        />

                        <MiniProgress
                          label="Assessment"
                          value={
                            dashboard
                              .careerReadiness
                              .assessment
                          }
                        />

                        <MiniProgress
                          label="Mock Interview"
                          value={
                            dashboard
                              .careerReadiness
                              .mockInterview
                          }
                        />

                        <MiniProgress
                          label="Roadmap"
                          value={
                            dashboard
                              .careerReadiness
                              .roadmap
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* INTERVIEW PROGRESS */}

                  <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-semibold">
                          Interview preparation
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                          Your question bank progress
                        </p>
                      </div>

                      <BrainCircuit className="text-cyan-300" />
                    </div>

                    <div className="mt-6">
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-3xl font-bold">
                            {
                              dashboard
                                .interview
                                .completed
                            }
                          </span>

                          <span className="text-zinc-500">
                            {" "}
                            /{" "}
                            {
                              dashboard
                                .interview
                                .total
                            }
                          </span>
                        </div>

                        <span className="text-sm text-cyan-300">
                          {
                            dashboard
                              .interview
                              .percentage
                          }
                          %
                        </span>
                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-cyan-500"
                          style={{
                            width: `${
                              dashboard
                                .interview
                                .percentage
                            }%`,
                          }}
                        />
                      </div>

                      <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
                        <Bookmark
                          size={14}
                        />

                        {
                          dashboard
                            .interview
                            .bookmarked
                        }{" "}
                        bookmarked questions
                      </div>

                      <Link
                        href="/interview-preparation"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-cyan-300"
                      >
                        Continue practice

                        <ArrowRight
                          size={15}
                        />
                      </Link>
                    </div>
                  </div>
                </section>

                {/* MAIN */}

                <section className="mt-6 grid items-start gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-6">

                    {/* QUICK ACTIONS */}

                    <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5 sm:p-6">
                      <h2 className="text-lg font-semibold">
                        Quick actions
                      </h2>

                      <p className="mt-1 text-sm text-zinc-500">
                        What would you like to work on today?
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <QuickAction
                          href="/resume-builder"
                          title="Build a resume"
                          description="Create or improve your professional resume."
                          icon={
                            FileText
                          }
                        />

                        <QuickAction
                          href="/interview-preparation"
                          title="Interview preparation"
                          description="Practice technical interview questions."
                          icon={
                            BrainCircuit
                          }
                        />

                        <QuickAction
                          href="/mock-interview"
                          title="AI mock interview"
                          description="Practice and receive AI feedback."
                          icon={
                            Sparkles
                          }
                        />

                        <QuickAction
                          href="/skill-assessment"
                          title="Skill assessment"
                          description="Measure your technical knowledge."
                          icon={
                            ClipboardCheck
                          }
                        />

                        <QuickAction
                          href="/roadmap"
                          title="Learning roadmap"
                          description="Continue your personalized learning path."
                          icon={
                            Map
                          }
                        />

                        <QuickAction
                          href="/ai-mentor"
                          title="AI Career Mentor"
                          description="Ask AI for personalized career guidance."
                          icon={
                            BriefcaseBusiness
                          }
                        />
                      </div>
                    </div>

                    {/* RECENT ACTIVITY */}

                    <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5 sm:p-6">
                      <h2 className="text-lg font-semibold">
                        Recent activity
                      </h2>

                      <p className="mt-1 text-sm text-zinc-500">
                        Your latest SkillPrep activity
                      </p>

                      {dashboard
                        .recentActivity
                        .length ? (
                        <div className="mt-5 space-y-3">
                          {dashboard.recentActivity.map(
                            (
                              activity
                            ) => (
                              <ActivityItem
                                key={`${activity.type}-${activity.id}`}
                                activity={
                                  activity
                                }
                              />
                            )
                          )}
                        </div>
                      ) : (
                        <EmptyState text="No activity yet. Start an assessment or interview." />
                      )}
                    </div>

                    {/* RECENT RESUMES */}

                    <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-semibold">
                            Recent resumes
                          </h2>

                          <p className="mt-1 text-sm text-zinc-500">
                            Your recently updated resumes
                          </p>
                        </div>

                        <Link
                          href="/resumes"
                          className="text-sm text-violet-300"
                        >
                          View all
                        </Link>
                      </div>

                      {dashboard
                        .recentResumes
                        .length ? (
                        <div className="mt-5 space-y-3">
                          {dashboard.recentResumes.map(
                            (
                              resume
                            ) => (
                              <Link
                                key={
                                  resume._id
                                }
                                href={`/resume-builder?id=${resume._id}`}
                                className="flex items-center gap-3 rounded-xl border border-white/[0.06] p-4 transition hover:border-violet-500/30"
                              >
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                                  <FileUser
                                    size={20}
                                    className="text-violet-300"
                                  />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium">
                                    {
                                      resume.title
                                    }
                                  </p>

                                  <p className="mt-1 text-xs text-zinc-500">
                                    Updated{" "}
                                    {formatDate(
                                      resume.updatedAt
                                    )}
                                  </p>
                                </div>

                                <span className="rounded-lg bg-amber-500/[0.08] px-2 py-1 text-xs text-amber-300">
                                  {
                                    resume.status
                                  }
                                </span>
                              </Link>
                            )
                          )}
                        </div>
                      ) : (
                        <EmptyState text="You haven't created a resume yet." />
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="space-y-6">

                    {/* ROADMAP */}

                    <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6">
                      <div className="flex items-center gap-2">
                        <Code2
                          size={18}
                          className="text-amber-300"
                        />

                        <h2 className="font-semibold">
                          Learning roadmap
                        </h2>
                      </div>

                      {dashboard.roadmap ? (
                        <>
                          <p className="mt-5 text-sm font-medium">
                            {
                              dashboard
                                .roadmap
                                .targetRole
                            }
                          </p>

                          <div className="mt-4 flex justify-between text-xs">
                            <span className="text-zinc-500">
                              Progress
                            </span>

                            <span className="text-amber-300">
                              {
                                dashboard
                                  .roadmap
                                  .progress
                              }
                              %
                            </span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                            <div
                              className="h-full rounded-full bg-amber-500"
                              style={{
                                width: `${
                                  dashboard
                                    .roadmap
                                    .progress
                                }%`,
                              }}
                            />
                          </div>

                          <Link
                            href="/roadmap"
                            className="mt-5 inline-flex items-center gap-2 text-sm text-amber-300"
                          >
                            Continue roadmap

                            <ArrowRight
                              size={14}
                            />
                          </Link>
                        </>
                      ) : (
                        <EmptyState text="Create your first learning roadmap." />
                      )}
                    </div>

                    {/* SKILLS */}

                    <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6">
                      <div className="flex items-center gap-2">
                        <Target
                          size={18}
                          className="text-emerald-300"
                        />

                        <h2 className="font-semibold">
                          Skill performance
                        </h2>
                      </div>

                      {dashboard
                        .skillPerformance
                        .length ? (
                        <div className="mt-5 space-y-5">
                          {dashboard.skillPerformance.map(
                            (
                              skill,
                              index
                            ) => (
                              <div
                                key={`${skill.technology}-${skill.topic}-${index}`}
                              >
                                <div className="flex justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-medium">
                                      {
                                        skill.technology
                                      }
                                    </p>

                                    <p className="text-xs text-zinc-600">
                                      {
                                        skill.topic
                                      }{" "}
                                      ·{" "}
                                      {
                                        skill.skillLevel
                                      }
                                    </p>
                                  </div>

                                  <span className="text-sm text-emerald-300">
                                    {
                                      skill.percentage
                                    }
                                    %
                                  </span>
                                </div>

                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                  <div
                                    className="h-full rounded-full bg-emerald-500"
                                    style={{
                                      width: `${skill.percentage}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            )
                          )}

                          <Link
                            href="/skill-assessment"
                            className="inline-flex items-center gap-2 text-sm text-emerald-300"
                          >
                            Take assessment

                            <ArrowRight
                              size={14}
                            />
                          </Link>
                        </div>
                      ) : (
                        <EmptyState text="Complete a skill assessment to see your performance." />
                      )}
                    </div>

                    {/* AI MENTOR */}

                    <div className="rounded-2xl border border-violet-500/15 bg-violet-500/[0.04] p-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
                        <Sparkles className="text-violet-300" />
                      </div>

                      <h2 className="mt-4 font-semibold">
                        Need guidance?
                      </h2>

                      <p className="mt-2 text-sm leading-6 text-zinc-500">
                        Ask your AI Career Mentor what to learn next, how to improve your resume, or how to prepare for interviews.
                      </p>

                      <Link
                        href="/ai-mentor"
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold"
                      >
                        Ask AI Mentor

                        <ArrowRight
                          size={15}
                        />
                      </Link>
                    </div>
                  </div>
                </section>
              </>
            ) : null}

            <footer className="mt-10 border-t border-white/[0.07] py-6 text-center text-xs text-zinc-600">
              SkillPrep AI · Your career preparation workspace
            </footer>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

/* =========================================================
   STAT
========================================================= */

function DashboardStatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold">
            {value}
          </p>

          <p className="mt-2 text-xs text-zinc-600">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
          <Icon
            size={20}
            className="text-violet-300"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  href,
  title,
  description,
  icon: Icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ElementType;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition hover:border-violet-400/30 hover:bg-violet-500/[0.04]"
    >
      <div className="flex items-center justify-between">
        <Icon
          size={21}
          className="text-violet-300"
        />

        <ArrowRight
          size={15}
          className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-violet-300"
        />
      </div>

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-zinc-500">
        {description}
      </p>
    </Link>
  );
}

/* =========================================================
   ACTIVITY
========================================================= */

function ActivityItem({
  activity,
}: {
  activity:
    DashboardActivity;
}) {
  const Icon =
    activity.type ===
    "assessment"
      ? Trophy
      : activity.type ===
          "mock"
        ? MessageSquare
        : FileText;

  return (
    <Link
      href={
        activity.href
      }
      className="flex items-center gap-3 rounded-xl border border-white/[0.06] p-4 transition hover:border-violet-500/30"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
        <Icon
          size={18}
          className="text-violet-300"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {activity.title}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          {
            activity.description
          }
        </p>
      </div>

      <span className="text-xs text-zinc-600">
        {formatDate(
          activity.date
        )}
      </span>
    </Link>
  );
}

/* =========================================================
   PROGRESS
========================================================= */

function MiniProgress({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-zinc-500">
          {label}
        </span>

        <span>
          {value}%
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyState({
  text,
}: {
  text: string;
}) {
  return (
    <div className="mt-5 rounded-xl border border-dashed border-white/[0.08] p-6 text-center">
      <CheckCircle2
        size={20}
        className="mx-auto text-zinc-700"
      />

      <p className="mt-2 text-xs leading-5 text-zinc-600">
        {text}
      </p>
    </div>
  );
}

/* =========================================================
   DATE
========================================================= */

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "numeric",
      month: "short",
    }
  ).format(date);
}
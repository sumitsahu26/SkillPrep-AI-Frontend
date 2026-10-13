"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Code2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  BookOpen,
  Target,
  Clock3,
  Filter,
  Sparkles,
  BookmarkCheck,
  Menu,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";

import {
  getInterviewQuestions,
  type InterviewQuestion,
  type Difficulty,
} from "@/services/interviewApi";

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",

  Medium: "border-amber-500/20 bg-amber-500/10 text-amber-300",

  Hard: "border-rose-500/20 bg-rose-500/10 text-rose-300",
};

export default function InterviewPreparationPage() {
  const [technology, setTechnology] = useState("All technologies");
  const [difficulty, setDifficulty] = useState("All levels");
  const [topic, setTopic] = useState("All topics");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getInterviewQuestions();

        if (response.success) {
          setQuestions(response.questions);
        }
      } catch (error) {
        console.error("Load interview questions error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load interview questions"
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, []);

  const technologies = useMemo(() => {
    const categories = Array.from(
      new Set(questions.map((question) => question.category))
    ).sort();

    return [
      {
        name: "All technologies",
        icon: "✦",
        subtitle: "Browse everything",
      },

      ...categories.map((category) => ({
        name: category,
        icon: category.substring(0, 2).toUpperCase(),
        subtitle: "Interview questions",
      })),
    ];
  }, [questions]);

  // Load progress from localStorage once on the client.
  useEffect(() => {
    try {
      setCompleted(
        JSON.parse(
          localStorage.getItem("skillprep-interview-completed") || "[]"
        )
      );

      setSaved(
        JSON.parse(localStorage.getItem("skillprep-interview-saved") || "[]")
      );
    } catch {
      setCompleted([]);
      setSaved([]);
    } finally {
      setStorageLoaded(true);
    }
  }, []);

  // Persist completed questions.
  useEffect(() => {
    if (storageLoaded) {
      localStorage.setItem(
        "skillprep-interview-completed",
        JSON.stringify(completed)
      );
    }
  }, [completed, storageLoaded]);

  // Persist bookmarked questions.
  useEffect(() => {
    if (storageLoaded) {
      localStorage.setItem("skillprep-interview-saved", JSON.stringify(saved));
    }
  }, [saved, storageLoaded]);

  const topics = useMemo(() => {
    const relevantQuestions = questions.filter(
      (question) =>
        technology === "All technologies" || question.category === technology
    );

    return [
      "All topics",
      ...Array.from(
        new Set(relevantQuestions.map((question) => question.topic))
      ).sort(),
    ];
  }, [technology, questions]);

  const filteredQuestions = useMemo(() => {
    const term = search.trim().toLowerCase();

    return questions.filter((question) => {
      const matchesTechnology =
        technology === "All technologies" || question.category === technology;

      const matchesDifficulty =
        difficulty === "All levels" || question.difficulty === difficulty;

      const matchesTopic = topic === "All topics" || question.topic === topic;

      const matchesSearch =
        !term ||
        `${question.question} ${question.answer} ${question.category} ${question.topic}`
          .toLowerCase()
          .includes(term);

      const matchesSaved = !showSavedOnly || saved.includes(question._id);

      return (
        matchesTechnology &&
        matchesDifficulty &&
        matchesTopic &&
        matchesSearch &&
        matchesSaved
      );
    });
  }, [questions, technology, difficulty, topic, search, saved, showSavedOnly]);

  const toggleCompleted = (id: string) => {
    setCompleted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const toggleSaved = (id: string) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const resetFilters = () => {
    setTechnology("All technologies");
    setDifficulty("All levels");
    setTopic("All topics");
    setSearch("");
    setShowSavedOnly(false);
  };

  const progress = Math.round((completed.length / questions.length) * 100);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#080b14] text-slate-100">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="min-h-screen lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="mx-auto max-w-[1500px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
            {/* Page heading */}
            <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
                  <Sparkles size={14} />
                  YOUR NEXT INTERVIEW STARTS HERE
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Interview Preparation
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Practice practical questions, revise key concepts, and track
                  your progress one topic at a time.
                </p>
              </div>

              {/* Progress card */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111624] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                  <Target size={22} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">Your progress</p>

                  <p className="mt-1 text-xl font-semibold">
                    {completed.length}
                    <span className="text-sm font-normal text-slate-500">
                      {" "}
                      / {questions.length} questions
                    </span>
                  </p>

                  <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <span className="text-sm font-semibold text-violet-300">
                  {progress}%
                </span>
              </div>
            </div>

            {/* Statistics */}
            <section className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Available questions",
                  value: questions.length,
                  icon: BookOpen,
                  color: "text-sky-300 bg-sky-400/10",
                },
                {
                  label: "Technologies",
                  value: technologies.length - 1,
                  icon: Code2,
                  color: "text-violet-300 bg-violet-400/10",
                },
                {
                  label: "Completed",
                  value: completed.length,
                  icon: CheckCircle2,
                  color: "text-emerald-300 bg-emerald-400/10",
                },
                {
                  label: "Bookmarked",
                  value: saved.length,
                  icon: BookmarkCheck,
                  color: "text-amber-300 bg-amber-400/10",
                },
              ].map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/[0.08] bg-[#111624] p-4 sm:p-5"
                  >
                    <div
                      className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                    >
                      <Icon size={19} />
                    </div>

                    <p className="text-2xl font-bold">{stat.value}</p>

                    <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </section>

            <div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
              {/* Technology sidebar */}
              <aside className="rounded-2xl border border-white/[0.08] bg-[#111624] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">Technologies</h2>
                  <Code2 size={17} className="text-slate-500" />
                </div>

                <div className="space-y-1.5">
                  {technologies.map((item) => {
                    const active = technology === item.name;

                    const count =
                      item.name === "All technologies"
                        ? questions.length
                        : questions.filter(
                            (question) => question.category === item.name
                          ).length;

                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          setTechnology(item.name);
                          setTopic("All topics");
                        }}
                        className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                          active
                            ? "border-violet-500/20 bg-violet-500/10"
                            : "border-transparent hover:bg-white/[0.04]"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                            active
                              ? "bg-violet-500/20 text-violet-200"
                              : "bg-white/[0.05] text-slate-300"
                          }`}
                        >
                          {item.icon}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span
                            className={`block text-sm font-medium ${
                              active ? "text-violet-200" : "text-slate-200"
                            }`}
                          >
                            {item.name}
                          </span>

                          <span className="mt-0.5 block text-xs text-slate-500">
                            {item.subtitle}
                          </span>
                        </span>

                        <span className="text-xs text-slate-500">{count}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-xl border border-violet-500/15 bg-violet-500/[0.06] p-4">
                  <Sparkles size={17} className="mb-2 text-violet-300" />

                  <p className="text-sm font-medium">Small steps add up</p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Complete a few questions daily and revisit your saved
                    questions before an interview.
                  </p>
                </div>
              </aside>

              {/* Questions section */}
              <section className="min-w-0">
                {/* Search and filters */}
                <div className="mb-4 rounded-2xl border border-white/[0.08] bg-[#111624] p-4 sm:p-5">
                  <div className="flex flex-col gap-3 lg:flex-row">
                    <label className="relative flex-1">
                      <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search questions, topics, answers..."
                        className="w-full rounded-xl border border-white/10 bg-[#0a0e18] py-3 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-500/50"
                      />
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0e18] px-3">
                        <Filter size={15} className="text-slate-500" />

                        <select
                          value={difficulty}
                          onChange={(event) =>
                            setDifficulty(event.target.value)
                          }
                          className="w-full bg-transparent py-3 text-sm text-slate-300 outline-none"
                        >
                          <option value="All levels" className="bg-[#111624]">
                            All levels
                          </option>

                          <option value="Easy" className="bg-[#111624]">
                            Easy
                          </option>

                          <option value="Medium" className="bg-[#111624]">
                            Medium
                          </option>

                          <option value="Hard" className="bg-[#111624]">
                            Hard
                          </option>
                        </select>
                      </label>

                      <label className="rounded-xl border border-white/10 bg-[#0a0e18] px-3">
                        <select
                          value={topic}
                          onChange={(event) => setTopic(event.target.value)}
                          className="w-full min-w-36 bg-transparent py-3 text-sm text-slate-300 outline-none"
                        >
                          {topics.map((item) => (
                            <option
                              key={item}
                              value={item}
                              className="bg-[#111624]"
                            >
                              {item}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-400">
                      <span className="font-semibold text-slate-200">
                        {filteredQuestions.length}
                      </span>{" "}
                      questions found
                    </p>

                    <button
                      onClick={() => setShowSavedOnly((value) => !value)}
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        showSavedOnly
                          ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                          : "border-white/10 text-slate-400 hover:bg-white/[0.04]"
                      }`}
                    >
                      <BookmarkCheck size={15} />

                      {showSavedOnly ? "Showing saved" : "Saved questions only"}
                    </button>
                  </div>
                </div>

                {isLoading && (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#111624] p-10 text-center">
                    <p className="text-sm text-slate-400">
                      Loading interview questions...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* Question cards */}
                <div className="space-y-3">
                  {!isLoading &&
                    filteredQuestions.map((question, index) => {
                      const isExpanded = expandedId === question._id;
                      const isCompleted = completed.includes(question._id);
                      const isSaved = saved.includes(question._id);

                      return (
                        <article
                          key={question._id}
                          className={`overflow-hidden rounded-2xl border bg-[#111624] transition ${
                            isExpanded
                              ? "border-violet-500/25"
                              : "border-white/[0.08]"
                          }`}
                        >
                          <div className="flex items-start gap-3 p-4 sm:p-5">
                            <button
                              aria-label={
                                isCompleted
                                  ? "Mark incomplete"
                                  : "Mark complete"
                              }
                              onClick={() => toggleCompleted(question._id)}
                              className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-300"
                            >
                              {isCompleted ? (
                                <CheckCircle2
                                  size={21}
                                  className="text-emerald-300"
                                />
                              ) : (
                                <Circle size={21} />
                              )}
                            </button>

                            <button
                              className="min-w-0 flex-1 text-left"
                              onClick={() =>
                                setExpandedId(isExpanded ? null : question._id)
                              }
                            >
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                                  Question {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-slate-400">
                                  {question.category}
                                </span>

                                <span
                                  className={`rounded-md border px-2 py-1 text-[11px] ${
                                    difficultyStyles[question.difficulty]
                                  }`}
                                >
                                  {question.difficulty}
                                </span>
                              </div>

                              <h3
                                className={`text-sm font-semibold leading-6 sm:text-base ${
                                  isCompleted
                                    ? "text-slate-400"
                                    : "text-slate-100"
                                }`}
                              >
                                {question.question}
                              </h3>

                              <p className="mt-1 text-xs text-slate-500">
                                {question.topic}
                              </p>
                            </button>

                            <button
                              aria-label={
                                isSaved
                                  ? "Remove bookmark"
                                  : "Bookmark question"
                              }
                              onClick={() => toggleSaved(question._id)}
                              className={`rounded-lg p-2 transition ${
                                isSaved
                                  ? "text-amber-300"
                                  : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                              }`}
                            >
                              <BookmarkCheck size={18} />
                            </button>

                            <button
                              aria-label={
                                isExpanded ? "Collapse answer" : "Expand answer"
                              }
                              onClick={() =>
                                setExpandedId(isExpanded ? null : question._id)
                              }
                              className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.05]"
                            >
                              {isExpanded ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-white/[0.07] px-4 pb-5 pt-4 sm:px-5 sm:pl-14">
                              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                                <BookOpen size={14} />
                                Answer
                              </div>

                              <p className="text-sm leading-7 text-slate-300">
                                {question.answer}
                              </p>
                              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                  <Clock3 size={13} />
                                  Suggested review: 2–4 min
                                </span>

                                <button
                                  onClick={() => toggleCompleted(question._id)}
                                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                    isCompleted
                                      ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                      : "bg-violet-600 text-white hover:bg-violet-500"
                                  }`}
                                >
                                  <CheckCircle2 size={15} />

                                  {isCompleted
                                    ? "Completed — mark again"
                                    : "Mark as completed"}
                                </button>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })}

                  {/* Empty state */}
                  {!isLoading && !error && filteredQuestions.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-[#111624] px-6 py-14 text-center">
                      <Search
                        size={28}
                        className="mx-auto mb-3 text-slate-600"
                      />

                      <h3 className="font-semibold">No questions found</h3>

                      <p className="mt-2 text-sm text-slate-500">
                        Try another search term or reset your filters.
                      </p>

                      <button
                        onClick={resetFilters}
                        className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
                      >
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-5 text-center text-xs leading-5 text-slate-600">
                  Progress and bookmarks are stored in this browser for now.
                  Connect an API later to sync them across devices.
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  Code2,
  Loader2,
  Map,
  Play,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";

import {
  deleteRoadmap,
  generateRoadmap,
  getRoadmap,
  getRoadmaps,
  toggleRoadmapTopic,
  type Roadmap,
} from "@/services/roadmapApi";

/* =========================================================
   OPTIONS
========================================================= */

const roleOptions = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "MERN Stack Developer",
  "React Developer",
  "Node.js Developer",
  "Next.js Developer",
  "Cloud Developer",
];

const experienceOptions = [
  "Fresher",
  "0-1 years",
  "1-3 years",
  "3-5 years",
  "5+ years",
];

const durationOptions = [4, 6, 8, 10, 12];

/* =========================================================
   PAGE
========================================================= */

export default function RoadmapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [targetRole, setTargetRole] = useState("Full Stack Developer");
  const [experience, setExperience] = useState("3-5 years");
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [skillsText, setSkillsText] = useState(
    "JavaScript, React, Node.js, MongoDB"
  );
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingTopic, setUpdatingTopic] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /* =====================================================
     LOAD ROADMAPS
  ===================================================== */

  const loadRoadmaps = async () => {
    try {
      setIsLoading(true);

      const response = await getRoadmaps();

      setRoadmaps(response.roadmaps || []);
    } catch (err) {
      console.error(err);

      setError(err instanceof Error ? err.message : "Failed to load roadmaps");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoadmaps();
  }, []);

  /* =====================================================
     GENERATE
  ===================================================== */

  const handleGenerate = async () => {
    try {
      setError("");
      setMessage("");

      const skills = skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      setIsGenerating(true);

      const response = await generateRoadmap({
        targetRole,
        experience,
        durationWeeks,
        currentSkills: skills,
      });

      setRoadmap(response.roadmap);

      setMessage("Your roadmap has been generated and saved.");

      await loadRoadmaps();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate roadmap"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  /* =====================================================
     OPEN ROADMAP
  ===================================================== */

  const handleOpen = async (id: string) => {
    try {
      setError("");

      const response = await getRoadmap(id);

      setRoadmap(response.roadmap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to open roadmap");
    }
  };

  /* =====================================================
     TOGGLE TOPIC
  ===================================================== */

  const handleToggleTopic = async (topicId: string) => {
    if (!roadmap) {
      return;
    }

    try {
      setUpdatingTopic(topicId);

      const response = await toggleRoadmapTopic(roadmap._id, topicId);

      setRoadmap(response.roadmap);

      setRoadmaps((previous) =>
        previous.map((item) =>
          item._id === response.roadmap._id ? response.roadmap : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update progress"
      );
    } finally {
      setUpdatingTopic(null);
    }
  };

  /* =====================================================
     DELETE
  ===================================================== */

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await deleteRoadmap(id);

      setRoadmaps((previous) => previous.filter((item) => item._id !== id));

      if (roadmap?._id === id) {
        setRoadmap(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete roadmap");
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     STATS
  ===================================================== */

  const completedTopics = useMemo(() => {
    if (!roadmap) {
      return 0;
    }

    return roadmap.steps
      .flatMap((step) => step.topics)
      .filter((topic) => topic.completed).length;
  }, [roadmap]);

  const totalTopics = useMemo(() => {
    if (!roadmap) {
      return 0;
    }

    return roadmap.steps.reduce((total, step) => total + step.topics.length, 0);
  }, [roadmap]);

  /* =====================================================
     UI
  ===================================================== */

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#080b12] dark:text-white">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* ================= HEADER ================= */}

            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <Map
                    size={21}
                    className="text-violet-600 dark:text-violet-300"
                  />

                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    Career Roadmap
                  </h1>
                </div>

                <p className="mt-2 text-sm text-zinc-600 dark:text-slate-500">
                  Build a personalized learning path and track your progress.
                </p>
              </div>

              {roadmap && (
                <button
                  type="button"
                  onClick={() => setRoadmap(null)}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:bg-transparent dark:text-slate-300 dark:hover:bg-white/[0.04]"
                >
                  <ArrowLeft size={16} />
                  All Roadmaps
                </button>
              )}
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/[0.06] dark:text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06] dark:text-emerald-300">
                {message}
              </div>
            )}

            {!roadmap ? (
              <>
                {/* ================= GENERATOR ================= */}

                <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101521]">
                    <div className="mb-6">
                      <div className="flex items-center gap-2">
                        <Sparkles
                          size={18}
                          className="text-violet-600 dark:text-violet-300"
                        />

                        <h2 className="font-semibold text-zinc-900 dark:text-white">
                          Generate AI Roadmap
                        </h2>
                      </div>

                      <p className="mt-1 text-sm text-zinc-600 dark:text-slate-500">
                        Tell us your goal and current skills.
                      </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <SelectField
                        label="Target Role"
                        value={targetRole}
                        options={roleOptions}
                        onChange={setTargetRole}
                      />

                      <SelectField
                        label="Experience"
                        value={experience}
                        options={experienceOptions}
                        onChange={setExperience}
                      />

                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-slate-400">
                          Duration
                        </label>

                        <select
                          value={durationWeeks}
                          onChange={(event) =>
                            setDurationWeeks(Number(event.target.value))
                          }
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-violet-500/50 dark:border-white/10 dark:bg-[#090d17] dark:text-white"
                        >
                          {durationOptions.map((weeks) => (
                            <option key={weeks} value={weeks}>
                              {weeks} weeks
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-slate-400">
                          Current Skills
                        </label>

                        <input
                          value={skillsText}
                          onChange={(event) =>
                            setSkillsText(event.target.value)
                          }
                          placeholder="React, Node.js, MongoDB..."
                          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500/50 dark:border-white/10 dark:bg-[#090d17] dark:text-white dark:placeholder:text-slate-600"
                        />

                        <p className="mt-2 text-xs text-zinc-500 dark:text-slate-600">
                          Separate skills with commas.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Creating your roadmap...
                        </>
                      ) : (
                        <>
                          <Sparkles size={17} />
                          Generate Roadmap
                        </>
                      )}
                    </button>
                  </div>

                  {/* HOW IT WORKS */}

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101521]">
                    <h2 className="font-semibold text-zinc-900 dark:text-white">
                      Your Learning Journey
                    </h2>

                    <div className="mt-6 space-y-5">
                      <FlowItem
                        number="01"
                        title="Set your goal"
                        text="Choose the role you want to prepare for."
                      />

                      <FlowItem
                        number="02"
                        title="AI creates your path"
                        text="A structured weekly plan is generated from your experience and skills."
                      />

                      <FlowItem
                        number="03"
                        title="Complete topics"
                        text="Mark individual topics complete as you learn."
                      />

                      <FlowItem
                        number="04"
                        title="Track progress"
                        text="Your roadmap automatically tracks your completion percentage."
                      />
                    </div>
                  </div>
                </div>

                {/* ================= SAVED ================= */}

                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-semibold text-zinc-900 dark:text-white">
                      My Roadmaps
                    </h2>

                    <span className="text-xs text-zinc-500 dark:text-slate-500">
                      {roadmaps.length} saved
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin text-violet-600 dark:text-violet-300" />
                    </div>
                  ) : roadmaps.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-white/10">
                      <Map className="mx-auto text-zinc-400 dark:text-slate-600" />

                      <p className="mt-3 text-sm text-zinc-500 dark:text-slate-400">
                        No roadmaps yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {roadmaps.map((item) => (
                        <div
                          key={item._id}
                          className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#101521]"
                        >
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="font-semibold text-zinc-900 dark:text-white">
                                {item.title}
                              </p>

                              <p className="mt-1 text-xs text-zinc-500 dark:text-slate-500">
                                {item.targetRole}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              disabled={deletingId === item._id}
                              className="text-zinc-400 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-300"
                            >
                              {deletingId === item._id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>

                          <div className="mt-5">
                            <div className="mb-2 flex justify-between text-xs">
                              <span className="text-zinc-500 dark:text-slate-500">
                                Progress
                              </span>

                              <span className="text-violet-600 dark:text-violet-300">
                                {item.progress}%
                              </span>
                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.06]">
                              <div
                                className="h-full rounded-full bg-violet-500"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock3 size={13} />
                              {item.durationWeeks} weeks
                            </span>

                            <span>{item.status}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpen(item._id)}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm text-violet-700 hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/15"
                          >
                            <Play size={15} />
                            Continue Roadmap
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* ================= ROADMAP DETAILS ================= */

              <div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101521]">
                  <div className="flex flex-col justify-between gap-5 md:flex-row">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-300">
                        AI Learning Roadmap
                      </span>

                      <h2 className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
                        {roadmap.title}
                      </h2>

                      <p className="mt-2 text-sm text-zinc-600 dark:text-slate-500">
                        {roadmap.targetRole} • {roadmap.experience} •{" "}
                        {roadmap.durationWeeks} weeks
                      </p>
                    </div>

                    <div className="min-w-[180px]">
                      <p className="text-right text-3xl font-bold text-violet-600 dark:text-violet-300">
                        {roadmap.progress}%
                      </p>

                      <p className="mt-1 text-right text-xs text-zinc-500 dark:text-slate-500">
                        {completedTopics} / {totalTopics} topics
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{ width: `${roadmap.progress}%` }}
                    />
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {roadmap.targetSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* STEPS */}

                <div className="mt-6 space-y-5">
                  {roadmap.steps.map((step) => (
                    <div
                      key={step._id}
                      className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101521]"
                    >
                      <div className="flex gap-4">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            step.completed
                              ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
                              : "bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 size={20} />
                          ) : (
                            <span className="text-sm font-bold">
                              {step.week}
                            </span>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-slate-500">
                            Week {step.week}
                          </p>

                          <h3 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
                            {step.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-slate-500">
                            {step.description}
                          </p>

                          {/* TOPICS */}

                          <div className="mt-5 space-y-2">
                            {step.topics.map((topic) => (
                              <button
                                key={topic._id}
                                type="button"
                                onClick={() => handleToggleTopic(topic._id)}
                                disabled={updatingTopic === topic._id}
                                className="flex w-full items-start gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-left transition hover:border-violet-300 hover:bg-violet-50 dark:border-white/[0.07] dark:bg-[#090d17] dark:hover:border-violet-500/20 dark:hover:bg-transparent"
                              >
                                <div
                                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                                    topic.completed
                                      ? "border-emerald-500 bg-emerald-500 text-white"
                                      : "border-zinc-300 dark:border-white/15"
                                  }`}
                                >
                                  {updatingTopic === topic._id ? (
                                    <Loader2
                                      size={12}
                                      className="animate-spin"
                                    />
                                  ) : topic.completed ? (
                                    <Check size={12} />
                                  ) : null}
                                </div>

                                <div>
                                  <p
                                    className={`text-sm font-medium ${
                                      topic.completed
                                        ? "text-zinc-500 line-through dark:text-slate-500"
                                        : "text-zinc-800 dark:text-slate-200"
                                    }`}
                                  >
                                    {topic.title}
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-slate-600">
                                    {topic.description}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>

                          {/* RESOURCES */}

                          {step.resources.length > 0 && (
                            <div className="mt-5">
                              <p className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-slate-500">
                                <BookOpen size={14} />
                                Resources & Practice
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {step.resources.map((resource, index) => (
                                  <span
                                    key={`${resource.title}-${index}`}
                                    className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-slate-400"
                                  >
                                    <Code2 size={13} />
                                    {resource.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {roadmap.progress === 100 && (
                  <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-500/20 dark:bg-emerald-500/[0.06]">
                    <CheckCircle2
                      size={34}
                      className="mx-auto text-emerald-600 dark:text-emerald-300"
                    />

                    <h3 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-white">
                      Roadmap Completed!
                    </h3>

                    <p className="mt-1 text-sm text-zinc-600 dark:text-slate-400">
                      You completed all {totalTopics} topics.
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setRoadmap(null)}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:bg-transparent dark:text-slate-400 dark:hover:bg-white/[0.04]"
                >
                  <RotateCcw size={15} />
                  Back to My Roadmaps
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-violet-500/50 dark:border-white/10 dark:bg-[#090d17] dark:text-white"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function FlowItem({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
        {number}
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

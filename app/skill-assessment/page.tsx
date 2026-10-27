"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  History,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  X,
} from "lucide-react";

import AuthGuard from "../components/AuthGuard";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  deleteSkillAssessment,
  getAssessmentBankCategories,
  getAssessmentBankTopics,
  getSkillAssessment,
  getSkillAssessments,
  startSkillAssessment,
  submitSkillAssessment,
  type AssessmentDifficulty,
  type SkillAssessment,
} from "@/services/skillAssessmentApi";
import { toast } from "sonner";


type PageMode = "setup" | "assessment" | "result";

const fallbackTechnologies = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "MongoDB",
  "MySQL",
  "AWS",
  "Docker",
  "Redis",
  "System Design",
];

const questionCounts = [1, 5, 10, 15, 20];

  //  PAGE

export default function SkillAssessmentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [mode, setMode] = useState<PageMode>("setup");

    //  CONFIG

  const [technology, setTechnology] = useState("Node.js");

  const [technologies, setTechnologies] = useState<string[]>(fallbackTechnologies);

  const [topics, setTopics] = useState<string[]>(["General"]);

  const [topic, setTopic] = useState("General");

  const [difficulty, setDifficulty] = useState<AssessmentDifficulty>("Medium");

  const [questionCount, setQuestionCount] = useState(10);

    //  ASSESSMENT

  const [assessment, setAssessment] = useState<SkillAssessment | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

    //  HISTORY

  const [history, setHistory] = useState<SkillAssessment[]>([]);

    //  LOADING

  const [isLoading, setIsLoading] = useState(true);

  const [isStarting, setIsStarting] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");

  // Load technologies
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getAssessmentBankCategories();

        if (response.categories.length > 0) {
          const merged = Array.from(new Set([...response.categories, ...fallbackTechnologies]));

          setTechnologies(merged);
        }
      } catch (error) {
        console.error("Load assessment categories:", error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadTopics = async () => {
      try {
        const response = await getAssessmentBankTopics(technology);

        setTopics(["General", ...response.topics.filter((item) => item !== "General")]);

        setTopic("General");
      } catch (error) {
        console.error("Load assessment topics:", error);

        setTopics(["General"]);

        setTopic("General");
      }
    };

    loadTopics();
  }, [technology]);

    //  LOAD HISTORY

  const loadHistory = async () => {
    try {
      setIsLoading(true);

      const response = await getSkillAssessments();

      setHistory(response.assessments || []);
    } catch (err) {
      console.error("Assessment history:", err);

      toast.error(err instanceof Error ? err.message : "Failed to load assessments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

    //  CURRENT QUESTION

  const currentQuestion = assessment?.questions[currentIndex];

  const answeredCount = Object.values(answers).filter(Boolean).length;

  const progress = assessment ? Math.round(((currentIndex + 1) / assessment.questions.length) * 100) : 0;

    //  START

  const handleStart = async () => {
    try {
      
      setMessage("");

      setIsStarting(true);

      const response = await startSkillAssessment({
        technology,
        topic,
        difficulty,
        questionCount,
      });

      const created = response.assessment;

      setAssessment(created);

      if (response.generatedCount && response.generatedCount > 0) {
        setMessage(`${response.generatedCount} new assessment questions were generated and saved to your question bank.`);
      } else {
        setMessage("Assessment loaded from your saved question bank.");
      }

      if (response.usedFallback) {
        setMessage(`Started with ${response.actualQuestionCount} available questions instead of ${response.requestedQuestionCount}.`);
      }

      setCurrentIndex(0);

      const savedAnswers: Record<string, string> = {};

      created.questions.forEach((question) => {
        if (question.selectedAnswer) {
          savedAnswers[question._id] = question.selectedAnswer;
        }
      });

      setAnswers(savedAnswers);

      setMode("assessment");

      await loadHistory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start assessment");
    } finally {
      setIsStarting(false);
    }
  };

    //  SELECT ANSWER

  const handleSelectAnswer = (questionId: string, option: string) => {
    setAnswers((previous) => ({
      ...previous,
      [questionId]: option,
    }));
  };

    //  NEXT

  const handleNext = () => {
    if (!assessment) {
      return;
    }

    if (currentIndex < assessment.questions.length - 1) {
      setCurrentIndex((previous) => previous + 1);
    }
  };

    //  PREVIOUS

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((previous) => previous - 1);
    }
  };

    //  SUBMIT

  const handleSubmit = async () => {
    if (!assessment) {
      return;
    }

    if (answeredCount === 0) {
      toast.error("Please answer at least one question.");

      return;
    }

    try {
      setIsSubmitting(true);

      

      const answerList = assessment.questions.map((question) => ({
        questionId: question._id,
        selectedAnswer: answers[question._id] || "",
      }));

      const response = await submitSkillAssessment(assessment._id, answerList);

      setAssessment(response.assessment);

      setMode("result");

      await loadHistory();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

    //  OPEN HISTORY

  const handleOpenAssessment = async (id: string) => {
    try {
      

      const response = await getSkillAssessment(id);

      const item = response.assessment;

      setAssessment(item);

      const existingAnswers: Record<string, string> = {};

      item.questions.forEach((question) => {
        if (question.selectedAnswer) {
          existingAnswers[question._id] = question.selectedAnswer;
        }
      });

      setAnswers(existingAnswers);

      if (item.status === "completed") {
        setMode("result");
      } else {
        setCurrentIndex(0);

        setMode("assessment");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open assessment");
    }
  };

    //  DELETE

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await deleteSkillAssessment(id);

      setHistory((previous) => previous.filter((item) => item._id !== id));

      if (assessment?._id === id) {
        handleNewAssessment();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete assessment");
    } finally {
      setDeletingId(null);
    }
  };

    //  NEW ASSESSMENT

  const handleNewAssessment = () => {
    setAssessment(null);

    setAnswers({});

    setCurrentIndex(0);

    

    setMessage("");

    setMode("setup");
  };

    //  HISTORY STATS

  const completedHistory = useMemo(() => history.filter((item) => item.status === "completed"), [history]);

  const averageScore = useMemo(() => {
    if (completedHistory.length === 0) {
      return 0;
    }

    const total = completedHistory.reduce((sum, item) => sum + item.percentage, 0);

    return Math.round(total / completedHistory.length);
  }, [completedHistory]);

    //  UI

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#080b12] dark:text-white">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* HEADER */}

            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <BrainCircuit size={22} className="text-violet-600 dark:text-violet-300" />

                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Skill Assessment</h1>
                </div>

                <p className="mt-2 text-sm text-zinc-600 dark:text-slate-500">
                  Test your technical skills with AI-powered assessments.
                </p>
              </div>

              {mode !== "setup" && (
                <button type="button" onClick={handleNewAssessment} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]">
                  <ArrowLeft size={16} />
                  Assessments
                </button>
              )}
            </div>

            {message && (
              <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/[0.06] dark:text-emerald-300">
                {message}
              </div>
            )}

            {/* =================================================
                SETUP
            ================================================= */}

            {mode === "setup" && (
              <>
                {/* STATS */}

                <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard title="Assessments" value={history.length} icon={BrainCircuit} />

                  <StatCard title="Completed" value={completedHistory.length} icon={CheckCircle2} />

                  <StatCard title="Average Score" value={`${averageScore}%`} icon={Target} />

                  <StatCard title="Best Score" value={`${completedHistory.length ? Math.max(...completedHistory.map((item) => item.percentage)) : 0}%`} icon={Trophy} />
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
                  {/* CONFIG */}

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101521]">
                    <div className="mb-6 flex items-center gap-2">
                      <Sparkles size={18} className="text-violet-600 dark:text-violet-300" />

                      <div>
                        <h2 className="font-semibold text-zinc-900 dark:text-white">Start Assessment</h2>

                        <p className="mt-1 text-xs text-zinc-600 dark:text-slate-500">
                          Configure your technical assessment.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <SelectField label="Technology" value={technology} options={technologies} onChange={setTechnology} />

                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-slate-400">Topic</label>

                        <select value={topic} onChange={(event) => setTopic(event.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-violet-500/50 dark:border-white/10 dark:bg-[#090d17] dark:text-white">
                          {topics.map((item) => (
                            <option key={item} value={item} className="bg-white text-zinc-900 dark:bg-[#090d17] dark:text-white">
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <SelectField label="Difficulty" value={difficulty} options={["Easy", "Medium", "Hard"]} onChange={(value) => setDifficulty(value as AssessmentDifficulty)} />

                      <div>
                        <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-slate-400">Questions</label>

                        <select value={questionCount} onChange={(event) => setQuestionCount(Number(event.target.value))} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-violet-500/50 dark:border-white/10 dark:bg-[#090d17] dark:text-white">
                          {questionCounts.map((count) => (
                            <option key={count} value={count} className="bg-white text-zinc-900 dark:bg-[#090d17] dark:text-white">
                              {count} questions
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button type="button" onClick={handleStart} disabled={isStarting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50">
                      {isStarting ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Preparing Assessment...
                        </>
                      ) : (
                        <>
                          <Play size={17} />
                          Start Assessment
                        </>
                      )}
                    </button>
                  </div>

                  {/* INFO */}

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101521]">
                    <h2 className="font-semibold text-zinc-900 dark:text-white">How Assessment Works</h2>

                    <div className="mt-6 space-y-5">
                      <InfoItem number="01" title="Choose your skill" text="Select technology, topic and difficulty." />

                      <InfoItem number="02" title="Answer MCQs" text="Complete AI-generated technical questions." />

                      <InfoItem number="03" title="Get your score" text="Your answers are checked automatically." />

                      <InfoItem number="04" title="Find weak areas" text="See strong topics and areas that need more practice." />
                    </div>
                  </div>
                </div>

                {/* HISTORY */}

                <div className="mt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <History size={17} className="text-zinc-500 dark:text-slate-500" />

                    <h2 className="font-semibold text-zinc-900 dark:text-white">Assessment History</h2>
                  </div>

                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin text-violet-600 dark:text-violet-300" />
                    </div>
                  ) : history.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center dark:border-white/10">
                      <BrainCircuit className="mx-auto text-zinc-400 dark:text-slate-600" />

                      <p className="mt-3 text-sm text-zinc-600 dark:text-slate-400">
                        No assessments yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {history.map((item) => (
                        <div key={item._id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#101521]">
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="font-semibold text-zinc-900 dark:text-white">{item.technology}</p>

                              <p className="mt-1 text-xs text-zinc-500 dark:text-slate-500">
                                {item.topic} • {item.difficulty}
                              </p>
                            </div>

                            <button type="button" onClick={() => handleDelete(item._id)} disabled={deletingId === item._id} className="text-zinc-400 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-300">
                              {deletingId === item._id ? (
                                <Loader2 size={15} className="animate-spin" />
                              ) : (
                                <Trash2 size={15} />
                              )}
                            </button>
                          </div>

                          <div className="mt-5 flex items-end justify-between">
                            <div>
                              <p className="text-xs text-zinc-500 dark:text-slate-500">Score</p>

                              <p className="mt-1 text-2xl font-bold text-violet-600 dark:text-violet-300">
                                {item.status === "completed" ? `${item.percentage}%` : "--"}
                              </p>
                            </div>

                            <span className="rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-600 dark:border-white/[0.07] dark:bg-white/[0.03] dark:text-slate-400">
                              {item.status === "completed" ? item.skillLevel : "In Progress"}
                            </span>
                          </div>

                          <button type="button" onClick={() => handleOpenAssessment(item._id)} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm text-violet-700 hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/15">
                            {item.status === "completed" ? "View Result" : "Continue Assessment"}

                            <ChevronRight size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* =================================================
                ASSESSMENT
            ================================================= */}

            {mode === "assessment" && assessment && currentQuestion && (
              <div className="mx-auto max-w-5xl">
                {/* PROGRESS */}

                <div className="mb-5 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#101521]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-600 dark:text-slate-400">
                      Question {currentIndex + 1} of {assessment.questions.length}
                    </span>

                    <span className="text-violet-600 dark:text-violet-300">
                      {answeredCount} answered
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.06]">
                    <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                  {/* QUESTION */}

                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101521]">
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-lg bg-violet-100 px-2.5 py-1 text-xs text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                        {currentQuestion.topic}
                      </span>

                      <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-white/[0.04] dark:text-slate-400">
                        {currentQuestion.difficulty}
                      </span>
                    </div>

                    <h2 className="mt-5 text-lg font-semibold leading-8 text-zinc-900 dark:text-white">
                      {currentQuestion.question}
                    </h2>

                    <div className="mt-6 space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const selected = answers[currentQuestion._id] === option;

                        return (
                          <button key={`${option}-${index}`} type="button" onClick={() => handleSelectAnswer(currentQuestion._id, option)} className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${selected ? "border-violet-500/50 bg-violet-50 text-violet-700 dark:border-violet-500/50 dark:bg-violet-500/10 dark:text-violet-200" : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300 dark:border-white/[0.08] dark:bg-[#090d17] dark:text-slate-300 dark:hover:border-white/15"}`}>
                            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${selected ? "bg-violet-500 text-white" : "bg-zinc-200 text-zinc-500 dark:bg-white/[0.05] dark:text-slate-500"}`}>
                              {String.fromCharCode(65 + index)}
                            </span>

                            <span>{option}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* NAVIGATION */}

                    <div className="mt-7 flex items-center justify-between gap-3 border-t border-zinc-200 pt-5 dark:border-white/[0.07]">
                      <button type="button" onClick={handlePrevious} disabled={currentIndex === 0} className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-600 disabled:opacity-30 dark:border-white/10 dark:text-slate-400">
                        <ArrowLeft size={16} />
                        Previous
                      </button>

                      {currentIndex === assessment.questions.length - 1 ? (
                        <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50">
                          {isSubmitting ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                          Submit Assessment
                        </button>
                      ) : (
                        <button type="button" onClick={handleNext} className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500">
                          Next
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* QUESTION NAVIGATOR */}

                  <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#101521]">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">Questions</p>

                    <div className="mt-4 grid grid-cols-5 gap-2">
                      {assessment.questions.map((question, index) => {
                        const active = index === currentIndex;

                        const answered = Boolean(answers[question._id]);

                        return (
                          <button key={question._id} type="button" onClick={() => setCurrentIndex(index)} className={`flex h-9 items-center justify-center rounded-lg border text-xs font-semibold ${active ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-500 dark:bg-violet-500/15 dark:text-violet-200" : answered ? "border-emerald-500/20 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300" : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-500"}`}>
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-5 space-y-2 text-xs text-zinc-500 dark:text-slate-500">
                      <p>
                        {answeredCount} / {assessment.questions.length} answered
                      </p>

                      <p>You can move between questions before submitting.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                RESULT
            ================================================= */}

            {mode === "result" && assessment && (
              <div className="mx-auto max-w-5xl">
                {/* RESULT HEADER */}

                <div className="rounded-2xl border border-zinc-200 bg-white p-7 text-center dark:border-white/[0.08] dark:bg-[#101521]">
                  <Trophy size={40} className="mx-auto text-violet-600 dark:text-violet-300" />

                  <p className="mt-4 text-sm text-zinc-500 dark:text-slate-500">
                    {assessment.technology} Skill Assessment
                  </p>

                  <p className="mt-3 text-5xl font-bold text-violet-600 dark:text-violet-300">
                    {assessment.percentage}%
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-white">
                    {assessment.skillLevel}
                  </p>

                  <p className="mt-2 text-sm text-zinc-500 dark:text-slate-500">
                    {assessment.score} correct out of {assessment.questions.length}
                  </p>
                </div>

                {/* TOPIC PERFORMANCE */}

                {assessment.topicPerformance.length > 0 && (
                  <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101521]">
                    <h2 className="font-semibold text-zinc-900 dark:text-white">Topic Performance</h2>

                    <div className="mt-5 space-y-4">
                      {assessment.topicPerformance.map((item) => (
                        <div key={item.topic}>
                          <div className="mb-2 flex justify-between text-sm">
                            <span className="text-zinc-700 dark:text-slate-300">{item.topic}</span>

                            <span className="text-zinc-500 dark:text-slate-500">
                              {item.correct}/{item.total} • {item.percentage}%
                            </span>
                          </div>

                          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.06]">
                            <div className="h-full rounded-full bg-violet-500" style={{ width: `${item.percentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STRONG + IMPROVEMENT */}

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/15 dark:bg-emerald-500/[0.04]">
                    <h3 className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-300">
                      <CheckCircle2 size={17} />
                      Strong Areas
                    </h3>

                    {assessment.strongAreas.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {assessment.strongAreas.map((area) => (
                          <p key={area} className="text-sm text-zinc-700 dark:text-slate-300">
                            ✓ {area}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-zinc-500 dark:text-slate-500">
                        Keep practicing to build stronger areas.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-500/15 dark:bg-amber-500/[0.04]">
                    <h3 className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-300">
                      <Target size={17} />
                      Needs Improvement
                    </h3>

                    {assessment.improvementAreas.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {assessment.improvementAreas.map((area) => (
                          <p key={area} className="text-sm text-zinc-700 dark:text-slate-300">
                            • {area}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-zinc-500 dark:text-slate-500">
                        Excellent performance across all topics.
                      </p>
                    )}
                  </div>
                </div>

                {/* ANSWER REVIEW */}

                <div className="mt-6">
                  <h2 className="mb-4 font-semibold text-zinc-900 dark:text-white">Answer Review</h2>

                  <div className="space-y-4">
                    {assessment.questions.map((question, index) => (
                      <div key={question._id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#101521]">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${question.isCorrect ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-300"}`}>
                            {question.isCorrect ? <Check size={15} /> : <X size={15} />}
                          </div>

                          <div className="flex-1">
                            <p className="text-xs text-zinc-500 dark:text-slate-500">Question {index + 1}</p>

                            <p className="mt-1 text-sm font-medium leading-6 text-zinc-800 dark:text-slate-200">
                              {question.question}
                            </p>

                            <div className="mt-4 space-y-2 text-sm">
                              <p className="text-zinc-500 dark:text-slate-500">
                                Your answer:{" "}
                                <span className={question.isCorrect ? "text-emerald-600 dark:text-emerald-300" : "text-red-600 dark:text-red-300"}>
                                  {question.selectedAnswer || "Not answered"}
                                </span>
                              </p>

                              {!question.isCorrect && (
                                <p className="text-zinc-500 dark:text-slate-500">
                                  Correct answer:{" "}
                                  <span className="text-emerald-600 dark:text-emerald-300">
                                    {question.correctAnswer}
                                  </span>
                                </p>
                              )}
                            </div>

                            {question.explanation && (
                              <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-500/10 dark:bg-violet-500/[0.04]">
                                <p className="text-xs font-semibold text-violet-600 dark:text-violet-300">
                                  Explanation
                                </p>

                                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-slate-400">
                                  {question.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={handleNewAssessment} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-500">
                  <RotateCcw size={16} />
                  Take Another Assessment
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

  //  SELECT FIELD

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
      <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-slate-400">{label}</label>

      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none focus:border-violet-500/50 dark:border-white/10 dark:bg-[#090d17] dark:text-white">
        {options.map((option) => (
          <option key={option} value={option} className="bg-white text-zinc-900 dark:bg-[#090d17] dark:text-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

  //  INFO

function InfoItem({
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
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">{number}</div>

      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-white">{title}</p>

        <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-slate-500">{text}</p>
      </div>
    </div>
  );
}

  //  STAT

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/[0.08] dark:bg-[#101521]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 dark:text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">{value}</p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
          <Icon size={19} />
        </div>
      </div>
    </div>
  );
}
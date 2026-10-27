"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  History,
  Loader2,
  MessageSquareText,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";
import {toast} from "sonner"

import {
  startMockInterview,
  getMockInterviews,
  getMockInterview,
  submitMockAnswer,
  completeMockInterview,
  abandonMockInterview,
  type MockInterview,
  type MockInterviewDifficulty,
  type MockAnswerEvaluation,
} from "@/services/mockInterviewApi";

  //  TECHNOLOGIES

const technologyOptions = [
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Express.js",
  "React",
  "Next.js",
  "MongoDB",
  "MySQL",
  "AWS",
  "Docker",
  "Redis",
  "System Design",
];

  //  TOPICS

const topicOptions: Record<string, string[]> = {
  JavaScript: [
    "General",
    "Variables",
    "Functions",
    "Closures",
    "Promises",
    "Async/Await",
    "Event Loop",
    "ES6",
    "Objects",
    "Arrays",
  ],

  TypeScript: [
    "General",
    "Types",
    "Interfaces",
    "Generics",
    "Enums",
    "Utility Types",
    "Type Guards",
  ],

  "Node.js": [
    "General",
    "Event Loop",
    "Streams",
    "Buffers",
    "Worker Threads",
    "Cluster",
    "Performance",
    "Authentication",
    "Error Handling",
    "File System",
    "Child Process",
  ],

  "Express.js": [
    "General",
    "Middleware",
    "Routing",
    "Authentication",
    "Error Handling",
    "REST API",
    "Validation",
    "Security",
  ],

  React: [
    "General",
    "Hooks",
    "State Management",
    "Performance",
    "Context API",
    "Redux",
    "Lifecycle",
    "Components",
    "Props",
    "Rendering",
  ],

  "Next.js": [
    "General",
    "SSR",
    "SSG",
    "CSR",
    "App Router",
    "Server Components",
    "Client Components",
    "API Routes",
    "Middleware",
  ],

  MongoDB: [
    "General",
    "Aggregation",
    "Indexing",
    "Lookup",
    "Schema Design",
    "Performance",
    "Transactions",
  ],

  MySQL: [
    "General",
    "Joins",
    "Indexes",
    "Transactions",
    "Normalization",
    "Queries",
    "Pagination",
  ],

  AWS: [
    "General",
    "Lambda",
    "API Gateway",
    "S3",
    "EC2",
    "SQS",
    "ECS",
    "CloudWatch",
  ],

  Docker: [
    "General",
    "Dockerfile",
    "Images",
    "Containers",
    "Volumes",
    "Networking",
    "Docker Compose",
  ],

  Redis: [
    "General",
    "Caching",
    "Sessions",
    "Pub/Sub",
    "Rate Limiting",
    "Data Structures",
  ],

  "System Design": [
    "General",
    "Scalability",
    "Load Balancing",
    "Caching",
    "Database Design",
    "Queues",
    "Microservices",
    "Rate Limiting",
    "High Availability",
  ],
};

  //  PAGE STATE

type PageMode = "setup" | "interview" | "result";

  //  PAGE

export default function MockInterviewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mode, setMode] = useState<PageMode>("setup");

  /* SETUP */

  const [technology, setTechnology] = useState("Node.js");
  const [topic, setTopic] = useState("General");

  const [difficulty, setDifficulty] =
    useState<MockInterviewDifficulty>("Medium");

  const [experience, setExperience] = useState("3-5 years");
  const [questionCount, setQuestionCount] = useState(5);

  /* INTERVIEW */

  const [interview, setInterview] = useState<MockInterview | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  /* HISTORY */

  const [history, setHistory] = useState<MockInterview[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  /* UI STATE */

  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const [message, setMessage] = useState("");

  const [resumingId, setResumingId] = useState<string | null>(null);

  /* EVALUATION */

  const [evaluation, setEvaluation] = useState<MockAnswerEvaluation | null>(
    null
  );

  const [evaluationSuccessful, setEvaluationSuccessful] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);

    //  LOAD HISTORY

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);

      const response = await getMockInterviews();

      if (response.success) {
        setHistory(response.interviews);
      }
    } catch (err) {
      console.error("Mock history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

    //  TOPICS

  const availableTopics = useMemo(() => {
    return topicOptions[technology] || ["General"];
  }, [technology]);

    //  CURRENT QUESTION

  const currentQuestion = interview?.questions?.[currentIndex];

    //  OPEN QUESTION

  const openQuestion = (
    index: number,
    targetInterview: MockInterview | null = interview
  ) => {
    if (!targetInterview) {
      return;
    }

    const question = targetInterview.questions[index];

    if (!question) {
      return;
    }

    setCurrentIndex(index);
    setAnswer(question.userAnswer || "");

    const hasEvaluation = Boolean(
      question.feedback ||
        question.betterAnswer ||
        (question.strengths && question.strengths.length > 0) ||
        (question.improvements && question.improvements.length > 0)
    );

    if (hasEvaluation) {
      setEvaluation({
        score: question.score ?? 0,
        feedback: question.feedback || "",
        strengths: question.strengths || [],
        improvements: question.improvements || [],
        betterAnswer: question.betterAnswer || "",
      });

      setEvaluationSuccessful(Boolean(question.betterAnswer));
      setShowEvaluation(true);
    } else {
      setEvaluation(null);
      setEvaluationSuccessful(false);
      setShowEvaluation(false);
    }
  };

    //  PROGRESS

  const progress =
    interview && interview.questions.length > 0
      ? Math.round(((currentIndex + 1) / interview.questions.length) * 100)
      : 0;

    //  TECHNOLOGY

  const handleTechnologyChange = (value: string) => {
    setTechnology(value);
    setTopic("General");
  };

    //  START INTERVIEW

  const handleStartInterview = async () => {
    try {
      setIsStarting(true);
      setMessage("");

      const response = await startMockInterview({
        technology,
        topic,
        difficulty,
        experience,
        questionCount,
      });

      if (!response.success) {
        toast.error(response.message || "Failed to start interview");
        return;
      }

      setInterview(response.interview);

      openQuestion(0, response.interview);

      setMode("interview");

      if (response.usedFallback) {
        setMessage(
          `You requested ${response.requestedQuestionCount} questions. ${response.actualQuestionCount} questions are currently available, so the interview started with those questions.`
        );
      }
    } catch (err) {
      console.error("Start mock interview:", err);

      toast.error(
        err instanceof Error ? err.message : "Failed to start mock interview"
      );
    } finally {
      setIsStarting(false);
    }
  };

    //  SAVE ANSWER

  const saveCurrentAnswer = async () => {
    if (!interview || !currentQuestion) {
      return;
    }

    if (!answer.trim()) {
      toast.error("Please enter your answer before continuing.");
      return;
    }

    try {
      setIsSubmitting(true);
      setEvaluation(null);
      setShowEvaluation(false);

      const response = await submitMockAnswer(
        interview._id,
        currentQuestion._id,
        answer.trim()
      );

      if (!response.success) {
        toast.error(response.message || "Failed to submit answer");
        return;
      }

      setInterview(response.interview);
      setEvaluation(response.evaluation);
      setEvaluationSuccessful(response.evaluationSuccessful);
      setShowEvaluation(true);
    } catch (err) {
      console.error("Submit answer:", err);

      toast.error(err instanceof Error ? err.message : "Failed to save answer");
    } finally {
      setIsSubmitting(false);
    }
  };

    //  NEXT

  const handleNext = async () => {
    if (!showEvaluation) {
      await saveCurrentAnswer();
      return;
    }

    if (!interview) {
      return;
    }

    const nextIndex = currentIndex + 1;

    if (nextIndex >= interview.questions.length) {
      await handleComplete(interview);
      return;
    }

    openQuestion(nextIndex);
  };

    //  PREVIOUS

  const handlePrevious = () => {
    if (!interview || currentIndex === 0) {
      return;
    }

    openQuestion(currentIndex - 1);
  };

    //  COMPLETE

  const handleComplete = async (
    targetInterview: MockInterview | null = interview
  ) => {
    if (!targetInterview) {
      return;
    }

    try {
      setIsCompleting(true);

      const response = await completeMockInterview(targetInterview._id);

      if (response.success) {
        setInterview(response.interview);
        setMode("result");
        await loadHistory();
      }
    } catch (err) {
      console.error("Complete interview:", err);

      toast.error(
        err instanceof Error ? err.message : "Failed to complete interview"
      );
    } finally {
      setIsCompleting(false);
    }
  };

    //  ABANDON

  const handleAbandon = async () => {
    if (!interview) {
      return;
    }

    try {
      await abandonMockInterview(interview._id);
    } catch (err) {
      console.error("Abandon interview:", err);
    }

    setInterview(null);
    setAnswer("");
    setCurrentIndex(0);
    setEvaluation(null);
    setEvaluationSuccessful(false);
    setShowEvaluation(false);
    setMode("setup");
    setMessage("");

    await loadHistory();
  };

    //  NEW INTERVIEW

  const handleNewInterview = () => {
    setInterview(null);
    setCurrentIndex(0);
    setAnswer("");
    setEvaluation(null);
    setEvaluationSuccessful(false);
    setShowEvaluation(false);
    setMessage("");
    setMode("setup");
  };

    //  RESUME INTERVIEW

  const handleResumeInterview = async (interviewId: string) => {
    try {
      setResumingId(interviewId);
      setMessage("");

      const response = await getMockInterview(interviewId);

      if (!response.success) {
        toast.error(response.message || "Failed to load interview");
        return;
      }

      const loadedInterview = response.interview;

      if (loadedInterview.status !== "in_progress") {
        toast.error("This interview is no longer in progress.");
        return;
      }

      let resumeIndex = loadedInterview.currentQuestionIndex;

      if (resumeIndex >= loadedInterview.questions.length) {
        resumeIndex = Math.max(loadedInterview.questions.length - 1, 0);
      }

      setInterview(loadedInterview);
      openQuestion(resumeIndex, loadedInterview);
      setMode("interview");
    } catch (err) {
      console.error("Resume mock interview:", err);

      toast.error(
        err instanceof Error ? err.message : "Failed to resume mock interview"
      );
    } finally {
      setResumingId(null);
    }
  };

    //  SETUP SCREEN

  const renderSetup = () => (
    <>
      <div className="mb-7">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
          <BrainCircuit size={14} />
          AI MOCK INTERVIEW
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Practice like a real interview
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-slate-400 sm:text-base">
          Select your technology, topic and experience level. SkillPrep will use
          your question bank and automatically generate missing questions when
          needed.
        </p>
      </div>

      {/* STATS */}

      <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          title="Mock interviews"
          value={history.length}
          icon={History}
        />

        <StatCard
          title="Completed"
          value={history.filter((item) => item.status === "completed").length}
          icon={CheckCircle2}
        />

        <StatCard
          title="In progress"
          value={history.filter((item) => item.status === "in_progress").length}
          icon={Clock3}
        />

        <StatCard
          title="Technologies"
          value={new Set(history.map((item) => item.technology)).size}
          icon={Code2}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* SETUP */}

        <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111624] dark:shadow-none sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Configure interview
            </h2>

            <p className="mt-1 text-sm text-zinc-600 dark:text-slate-400">
              Choose the type of interview you want to practice.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <SelectField
              label="Technology"
              value={technology}
              onChange={handleTechnologyChange}
              options={technologyOptions}
            />

            <SelectField
              label="Topic"
              value={topic}
              onChange={setTopic}
              options={availableTopics}
            />

            <SelectField
              label="Difficulty"
              value={difficulty}
              onChange={(value) =>
                setDifficulty(value as MockInterviewDifficulty)
              }
              options={["Easy", "Medium", "Hard"]}
            />

            <SelectField
              label="Experience"
              value={experience}
              onChange={setExperience}
              options={[
                "Fresher",
                "0-1 years",
                "1-3 years",
                "3-5 years",
                "5+ years",
              ]}
            />

            <SelectField
              label="Questions"
              value={String(questionCount)}
              onChange={(value) => setQuestionCount(Number(value))}
              options={["1", "5", "10", "15", "20"]}
            />
          </div>

          <div className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/15 dark:bg-violet-500/[0.06]">
            <div className="flex gap-3">
              <Database
                size={18}
                className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-300"
              />

              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  Database-first interview
                </p>

                <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-slate-400">
                  Existing questions are used first. If there are not enough, AI
                  generates only the missing questions and saves them to your
                  question bank.
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartInterview}
            disabled={isStarting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isStarting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Preparing interview...
              </>
            ) : (
              <>
                <Play size={18} />
                Start Mock Interview
              </>
            )}
          </button>
        </section>

        {/* HOW IT WORKS */}

        <aside className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111624] dark:shadow-none">
          <h2 className="font-semibold text-zinc-900 dark:text-white">
            Interview flow
          </h2>

          <div className="mt-5 space-y-5">
            <FlowItem
              number="01"
              title="Question bank"
              description="Questions are selected from your MongoDB question bank."
            />

            <FlowItem
              number="02"
              title="AI fills missing questions"
              description="AI is called only when the database does not have enough matching questions."
            />

            <FlowItem
              number="03"
              title="Answer one by one"
              description="Write your interview answer and continue to the next question."
            />

            <FlowItem
              number="04"
              title="Complete interview"
              description="Your interview session and answers remain stored in MongoDB."
            />
          </div>
        </aside>
      </div>

      {/* HISTORY */}

      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Recent interviews
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-slate-500">
              Your mock interview history.
            </p>
          </div>

          {historyLoading && (
            <Loader2
              size={18}
              className="animate-spin text-violet-600 dark:text-violet-300"
            />
          )}
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-white/10 dark:bg-[#111624]">
            <History
              size={28}
              className="mx-auto mb-3 text-zinc-400 dark:text-slate-600"
            />

            <p className="font-medium text-zinc-900 dark:text-white">
              No mock interviews yet
            </p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-slate-500">
              Start your first interview above.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {history.slice(0, 6).map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#111624] dark:shadow-none"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-slate-500">
                      {item.topic} • {item.difficulty} • {item.questionCount}{" "}
                      questions
                    </p>
                  </div>

                  <StatusBadge status={item.status} />
                </div>

                {item.status === "in_progress" && (
                  <button
                    type="button"
                    onClick={() => handleResumeInterview(item._id)}
                    disabled={resumingId === item._id}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 transition hover:bg-violet-100 disabled:opacity-50 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/15"
                  >
                    {resumingId === item._id ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Resume Interview
                      </>
                    )}
                  </button>
                )}

                {item.status === "completed" && (
                  <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-3 text-sm dark:border-white/[0.06]">
                    <span className="text-zinc-500 dark:text-slate-500">
                      Score
                    </span>

                    <span className="font-semibold text-violet-600 dark:text-violet-300">
                      {item.percentage}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );

    //  INTERVIEW SCREEN

  const renderInterview = () => {
    if (!interview || !currentQuestion) {
      return null;
    }

    const total = interview.questions.length;
    const isLast = currentIndex === total - 1;

    return (
      <>
        {/* TOP */}

        <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                {interview.technology}
              </span>

              <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                {interview.topic}
              </span>

              <span className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                {interview.difficulty}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white sm:text-3xl">
              {interview.title}
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-slate-500">
              Question {currentIndex + 1} of {total}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAbandon}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/[0.06] dark:text-rose-300 dark:hover:bg-rose-500/10"
          >
            <XCircle size={16} />
            Exit interview
          </button>
        </div>

        {/* PROGRESS */}

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-slate-500">
              Interview progress
            </span>

            <span className="font-medium text-violet-600 dark:text-violet-300">
              {progress}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-violet-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/[0.08] dark:text-amber-200">
            {message}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* QUESTION */}

          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111624] dark:shadow-none sm:p-7">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-slate-500">
                  Question {String(currentIndex + 1).padStart(2, "0")}
                </span>

                {currentQuestion.source === "ai" && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-[11px] text-violet-700 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300">
                    <Sparkles size={10} />
                    AI
                  </span>
                )}

                {currentQuestion.source === "database" && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-[11px] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-300">
                    <Database size={10} />
                    Question Bank
                  </span>
                )}
              </div>

              <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                {currentQuestion.difficulty}
              </span>
            </div>

            <h2 className="text-lg font-semibold leading-8 text-zinc-900 dark:text-white sm:text-xl">
              {currentQuestion.question}
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-slate-500">
              {currentQuestion.topic}
            </p>

            {/* ANSWER */}

            <div className="mt-7">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-slate-300">
                Your answer
              </label>

              <textarea
                value={answer}
                disabled={showEvaluation}
                onChange={(event) => setAnswer(event.target.value)}
                rows={10}
                placeholder="Answer as you would in a real interview..."
                className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm leading-7 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-violet-500/50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-white/10 dark:bg-[#090d17] dark:text-slate-200 dark:placeholder:text-slate-600"
              />

              <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-slate-600">
                <span>Explain your answer clearly and practically.</span>

                <span>{answer.trim().length} characters</span>
              </div>
            </div>

            {/* EVALUATION */}

            {showEvaluation && evaluation && (
              <div className="mt-6 space-y-4 border-t border-zinc-200 pt-6 dark:border-white/[0.07]">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles
                        size={18}
                        className="text-violet-600 dark:text-violet-300"
                      />

                      <h3 className="font-semibold text-zinc-900 dark:text-white">
                        AI Evaluation
                      </h3>
                    </div>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-slate-500">
                      Evaluation of your interview answer
                    </p>
                  </div>

                  {evaluationSuccessful && (
                    <div className="flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 dark:border-violet-500/20 dark:bg-violet-500/10">
                      <span className="text-xs text-zinc-500 dark:text-slate-400">
                        Score
                      </span>

                      <span className="text-xl font-bold text-violet-600 dark:text-violet-300">
                        {evaluation.score}/10
                      </span>
                    </div>
                  )}
                </div>

                {/* FAILED */}

                {!evaluationSuccessful && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/[0.07]">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      Evaluation unavailable
                    </p>

                    <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-slate-400">
                      Your answer has been saved successfully. You can continue
                      with the interview.
                    </p>
                  </div>
                )}

                {/* FEEDBACK */}

                {evaluationSuccessful && evaluation.feedback && (
                  <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/15 dark:bg-violet-500/[0.05]">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-violet-300">
                      Feedback
                    </p>

                    <p className="text-sm leading-7 text-zinc-700 dark:text-slate-300">
                      {evaluation.feedback}
                    </p>
                  </div>
                )}

                {/* STRENGTHS */}

                {evaluationSuccessful && evaluation.strengths.length > 0 && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/15 dark:bg-emerald-500/[0.05]">
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-600 dark:text-emerald-300"
                      />

                      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                        Strengths
                      </p>
                    </div>

                    <div className="space-y-2">
                      {evaluation.strengths.map((strength, index) => (
                        <div
                          key={index}
                          className="flex gap-2 text-sm leading-6 text-zinc-700 dark:text-slate-300"
                        >
                          <span className="text-emerald-500 dark:text-emerald-400">
                            •
                          </span>

                          <span>{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* IMPROVEMENTS */}

                {evaluationSuccessful && evaluation.improvements.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/15 dark:bg-amber-500/[0.05]">
                    <div className="mb-3 flex items-center gap-2">
                      <Target
                        size={16}
                        className="text-amber-600 dark:text-amber-300"
                      />

                      <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                        Areas to Improve
                      </p>
                    </div>

                    <div className="space-y-2">
                      {evaluation.improvements.map((improvement, index) => (
                        <div
                          key={index}
                          className="flex gap-2 text-sm leading-6 text-zinc-700 dark:text-slate-300"
                        >
                          <span className="text-amber-500 dark:text-amber-400">
                            •
                          </span>

                          <span>{improvement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BETTER ANSWER */}

                {evaluationSuccessful && evaluation.betterAnswer && (
                  <div className="rounded-xl border border-sky-200 bg-sky-50 p-4 dark:border-sky-500/15 dark:bg-sky-500/[0.05]">
                    <div className="mb-3 flex items-center gap-2">
                      <MessageSquareText
                        size={16}
                        className="text-sky-600 dark:text-sky-300"
                      />

                      <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                        Better Interview Answer
                      </p>
                    </div>

                    <p className="whitespace-pre-line text-sm leading-7 text-zinc-700 dark:text-slate-300">
                      {evaluation.betterAnswer}
                    </p>
                  </div>
                )}
              </div>
            )}


            {/* NAVIGATION */}

            <div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-zinc-200 pt-5 dark:border-white/[0.07] sm:flex-row">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0 || isSubmitting || isCompleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.04]"
              >
                <ArrowLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting || isCompleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    AI is evaluating...
                  </>
                ) : isCompleting ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Completing...
                  </>
                ) : !showEvaluation ? (
                  <>
                    <Sparkles size={17} />
                    Submit Answer
                  </>
                ) : isLast ? (
                  <>
                    <CheckCircle2 size={17} />
                    Finish Interview
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>
          </section>

          {/* SIDE */}

          <aside className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111624] dark:shadow-none">
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                Interview details
              </h3>

              <div className="mt-4 space-y-4">
                <Detail label="Technology" value={interview.technology} />
                <Detail label="Topic" value={interview.topic} />
                <Detail label="Difficulty" value={interview.difficulty} />
                <Detail label="Experience" value={interview.experience} />
                <Detail label="Questions" value={String(total)} />
              </div>
            </div>

            {/* QUESTION NAV */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111624] dark:shadow-none">
              <h3 className="font-semibold text-zinc-900 dark:text-white">
                Questions
              </h3>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {interview.questions.map((item, index) => {
                  const answered = Boolean(item.userAnswer?.trim());
                  const active = index === currentIndex;

                  return (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => openQuestion(index)}
                      className={`flex h-10 items-center justify-center rounded-lg border text-xs font-semibold transition ${
                        active
                          ? "border-violet-500 bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-200"
                          : answered
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-500"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-4 text-[11px] text-zinc-500 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Answered
                </span>

                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  Current
                </span>
              </div>
            </div>

            {/* TIP */}

            <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5 dark:border-sky-500/15 dark:bg-sky-500/[0.05]">
              <MessageSquareText
                size={19}
                className="text-sky-600 dark:text-sky-300"
              />

              <p className="mt-3 text-sm font-medium text-zinc-900 dark:text-white">
                Interview tip
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-slate-400">
                Answer like you are speaking to an interviewer. Give the
                definition, explain how it works, then add a practical example.
              </p>
            </div>
          </aside>
        </div>
      </>
    );
  };

    //  RESULT SCREEN

  const renderResult = () => {
    if (!interview) {
      return null;
    }

    const answered = interview.questions.filter((item) =>
      item.userAnswer?.trim()
    ).length;

    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
            <Trophy size={30} />
          </div>

          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
            Interview completed
          </h1>

          <p className="mt-2 text-zinc-600 dark:text-slate-400">
            {interview.title}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <ResultStat
            title="Questions"
            value={String(interview.questions.length)}
          />

          <ResultStat title="Answered" value={String(answered)} />

          <ResultStat title="Score" value={`${interview.percentage}%`} />
        </div>

        {/* SUMMARY */}

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-[#111624] dark:shadow-none sm:p-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Interview summary
          </h2>

          <div className="mt-5 space-y-4">
            {interview.questions.map((question, index) => (
              <div
                key={question._id}
                className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/[0.07] dark:bg-[#0b0f19]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-6 text-zinc-900 dark:text-white">
                      {question.question}
                    </p>

                    {/* USER ANSWER */}

                    <div className="mt-3 rounded-lg bg-white p-3 dark:bg-white/[0.03]">
                      <p className="mb-1 text-xs font-medium text-zinc-500 dark:text-slate-500">
                        Your answer
                      </p>

                      <p className="text-sm leading-6 text-zinc-700 dark:text-slate-300">
                        {question.userAnswer || "Not answered"}
                      </p>
                    </div>

                    {/* SCORE */}

                    <div className="mt-3 flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-white/[0.07] dark:bg-white/[0.03]">
                      <span className="text-xs text-zinc-500 dark:text-slate-500">
                        AI Score
                      </span>

                      <span className="text-lg font-bold text-violet-600 dark:text-violet-300">
                        {question.score ?? 0}/10
                      </span>
                    </div>

                    {/* FEEDBACK */}

                    {question.feedback && (
                      <div className="mt-3 rounded-lg border border-violet-200 bg-violet-50 p-3 dark:border-violet-500/15 dark:bg-violet-500/[0.05]">
                        <p className="mb-1 text-xs font-medium text-violet-700 dark:text-violet-300">
                          AI Feedback
                        </p>

                        <p className="text-sm leading-6 text-zinc-700 dark:text-slate-300">
                          {question.feedback}
                        </p>
                      </div>
                    )}

                    {/* STRENGTHS */}

                    {question.strengths && question.strengths.length > 0 && (
                      <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/15 dark:bg-emerald-500/[0.05]">
                        <p className="mb-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                          Strengths
                        </p>

                        <ul className="space-y-1">
                          {question.strengths.map((strength, strengthIndex) => (
                            <li
                              key={strengthIndex}
                              className="text-sm text-zinc-700 dark:text-slate-300"
                            >
                              • {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* IMPROVEMENTS */}

                    {question.improvements &&
                      question.improvements.length > 0 && (
                        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/15 dark:bg-amber-500/[0.05]">
                          <p className="mb-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                            Areas to improve
                          </p>

                          <ul className="space-y-1">
                            {question.improvements.map(
                              (improvement, improvementIndex) => (
                                <li
                                  key={improvementIndex}
                                  className="text-sm text-zinc-700 dark:text-slate-300"
                                >
                                  • {improvement}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {/* BETTER ANSWER */}

                    {question.betterAnswer && (
                      <div className="mt-3 rounded-lg border border-sky-200 bg-sky-50 p-3 dark:border-sky-500/15 dark:bg-sky-500/[0.05]">
                        <p className="mb-2 text-xs font-medium text-sky-700 dark:text-sky-300">
                          Better Interview Answer
                        </p>

                        <p className="whitespace-pre-line text-sm leading-6 text-zinc-700 dark:text-slate-300">
                          {question.betterAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleNewInterview}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500"
          >
            <RotateCcw size={17} />
            Start Another Interview
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs leading-5 text-amber-700 dark:border-amber-500/15 dark:bg-amber-500/[0.05] dark:text-amber-200">
          AI answer evaluation is not connected yet, so the score will remain 0
          until we add the evaluation API.
        </div>
      </div>
    );
  };

    //  MAIN

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors dark:bg-[#080b14] dark:text-slate-100">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="min-h-screen lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="mx-auto max-w-[1500px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
            {mode === "setup" && renderSetup()}

            {mode === "interview" && renderInterview()}

            {mode === "result" && renderResult()}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

  //  SMALL COMPONENTS

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
    <label>
      <span className="mb-2 block text-xs font-medium text-zinc-600 dark:text-slate-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm text-zinc-800 outline-none transition focus:border-violet-500/50 dark:border-white/10 dark:bg-[#090d17] dark:text-slate-300"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-white text-zinc-900 dark:bg-[#111624] dark:text-slate-200"
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

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
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/[0.08] dark:bg-[#111624] dark:shadow-none">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
        <Icon size={19} />
      </div>

      <p className="text-2xl font-bold text-zinc-900 dark:text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-500 dark:text-slate-500">{title}</p>
    </div>
  );
}

function FlowItem({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
        {number}
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-zinc-500 dark:text-slate-500">{label}</span>

      <span className="text-right text-sm font-medium text-zinc-700 dark:text-slate-300">
        {value}
      </span>
    </div>
  );
}

function ResultStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-sm dark:border-white/[0.08] dark:bg-[#111624] dark:shadow-none">
      <p className="text-2xl font-bold text-violet-600 dark:text-violet-300">
        {value}
      </p>

      <p className="mt-1 text-xs text-zinc-500 dark:text-slate-500">{title}</p>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/[0.07] dark:text-rose-300">
      {message}
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "in_progress" | "completed" | "abandoned";
}) {
  const style =
    status === "completed"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"
      : status === "in_progress"
      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
      : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300";

  return (
    <span
      className={`rounded-md border px-2 py-1 text-[11px] capitalize ${style}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

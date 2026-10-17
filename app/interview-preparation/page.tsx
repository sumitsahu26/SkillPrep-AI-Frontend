"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  WandSparkles,
  Loader2,
  Database,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";

import {
  getInterviewQuestions,
  getInterviewProgress,
  toggleCompletedQuestion,
  toggleBookmarkQuestion,
  type InterviewQuestion,
  type Difficulty,
} from "@/services/interviewApi";

import {
  generateAIQuestions,
  type AIDifficulty,
} from "@/services/aiInterviewApi";

/* =========================================================
   DIFFICULTY
========================================================= */

const difficultyStyles: Record<
  Difficulty,
  string
> = {
  Easy:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",

  Medium:
    "border-amber-500/20 bg-amber-500/10 text-amber-300",

  Hard:
    "border-rose-500/20 bg-rose-500/10 text-rose-300",
};

/* =========================================================
   AI TECHNOLOGIES
========================================================= */

const aiTechnologyOptions = [
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

/* =========================================================
   AI TOPICS
========================================================= */

const aiTopicOptions: Record<
  string,
  string[]
> = {
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

/* =========================================================
   FALLBACK
========================================================= */

const fallbackQuestions: InterviewQuestion[] =
  [
    {
      _id: "fallback-js-1",

      category:
        "JavaScript",

      topic:
        "Core JavaScript",

      question:
        "What is the difference between var, let, and const?",

      answer:
        "var is function scoped, while let and const are block scoped. let can be reassigned, while const cannot be reassigned after declaration.",

      difficulty:
        "Easy",

      tags: [
        "javascript",
        "variables",
      ],

      isActive:
        true,
    },

    {
      _id:
        "fallback-js-2",

      category:
        "JavaScript",

      topic:
        "Async JavaScript",

      question:
        "Explain the JavaScript event loop.",

      answer:
        "The event loop allows JavaScript to handle asynchronous operations. It monitors the call stack and queues and moves callbacks to the call stack when the stack becomes empty.",

      difficulty:
        "Medium",

      tags: [
        "javascript",
        "event-loop",
      ],

      isActive:
        true,
    },

    {
      _id:
        "fallback-node-1",

      category:
        "Node.js",

      topic:
        "Event Loop",

      question:
        "How does the Node.js event loop work?",

      answer:
        "Node.js uses the event loop to perform non-blocking I/O operations. Network and file operations can be handled asynchronously while JavaScript continues executing.",

      difficulty:
        "Medium",

      tags: [
        "nodejs",
        "event-loop",
      ],

      isActive:
        true,
    },

    {
      _id:
        "fallback-node-2",

      category:
        "Node.js",

      topic:
        "Performance",

      question:
        "How would you handle CPU-intensive work in Node.js?",

      answer:
        "CPU-intensive work should not block the main event loop. Worker threads, child processes, queues, or separate services can be used depending on the workload.",

      difficulty:
        "Hard",

      tags: [
        "nodejs",
        "performance",
      ],

      isActive:
        true,
    },

    {
      _id:
        "fallback-react-1",

      category:
        "React",

      topic:
        "Hooks",

      question:
        "What is the difference between useMemo and useCallback?",

      answer:
        "useMemo memoizes a calculated value, while useCallback memoizes a function reference.",

      difficulty:
        "Medium",

      tags: [
        "react",
        "hooks",
      ],

      isActive:
        true,
    },

    {
      _id:
        "fallback-mongodb-1",

      category:
        "MongoDB",

      topic:
        "Database",

      question:
        "What is an index in MongoDB?",

      answer:
        "An index helps MongoDB find documents faster without scanning every document. It improves read performance but uses storage and can affect writes.",

      difficulty:
        "Medium",

      tags: [
        "mongodb",
        "index",
      ],

      isActive:
        true,
    },
  ];

/* =========================================================
   PAGE
========================================================= */

export default function InterviewPreparationPage() {
  /* Question filters */

  const [
    technology,
    setTechnology,
  ] = useState(
    "All technologies"
  );

  const [
    difficulty,
    setDifficulty,
  ] = useState(
    "All levels"
  );

  const [
    topic,
    setTopic,
  ] = useState(
    "All topics"
  );

  const [
    search,
    setSearch,
  ] = useState("");

  /* Questions */

  const [
    questions,
    setQuestions,
  ] = useState<
    InterviewQuestion[]
  >([]);

  const [
    expandedId,
    setExpandedId,
  ] = useState<
    string | null
  >(null);

  const [
    completed,
    setCompleted,
  ] = useState<
    string[]
  >([]);

  const [
    saved,
    setSaved,
  ] = useState<
    string[]
  >([]);

  const [
    showSavedOnly,
    setShowSavedOnly,
  ] = useState(false);

  /* Page */

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  /* AI */

  const [
    aiTechnology,
    setAiTechnology,
  ] = useState(
    "Node.js"
  );

  const [
    aiTopic,
    setAiTopic,
  ] = useState(
    "General"
  );

  const [
    aiDifficulty,
    setAiDifficulty,
  ] =
    useState<AIDifficulty>(
      "Medium"
    );

  const [
    experience,
    setExperience,
  ] = useState(
    "3-5 years"
  );

  const [
    aiQuestionCount,
    setAiQuestionCount,
  ] = useState(5);

  const [
    isGeneratingAI,
    setIsGeneratingAI,
  ] = useState(false);

  const [
    aiMessage,
    setAiMessage,
  ] = useState("");

  const [
    aiMessageType,
    setAiMessageType,
  ] =
    useState<
      "success" | "error" | ""
    >("");

  /* =====================================================
     LOAD DATA
  ===================================================== */

  const loadQuestionBank =
    async () => {
      const response =
        await getInterviewQuestions();

      if (
        response.success &&
        response.questions
          .length > 0
      ) {
        setQuestions(
          response.questions
        );

        return;
      }

      setQuestions(
        fallbackQuestions
      );
    };

  useEffect(() => {
    const loadData =
      async () => {
        try {
          setIsLoading(true);

          setError("");

          try {
            await loadQuestionBank();
          } catch (err) {
            console.error(
              "Question API:",
              err
            );

            setQuestions(
              fallbackQuestions
            );
          }

          try {
            const progress =
              await getInterviewProgress();

            if (
              progress.success
            ) {
              setCompleted(
                progress.progress
                  .completedQuestions
              );

              setSaved(
                progress.progress
                  .bookmarkedQuestions
              );
            }
          } catch (err) {
            console.error(
              "Progress API:",
              err
            );
          }
        } finally {
          setIsLoading(
            false
          );
        }
      };

    loadData();
  }, []);

  /* =====================================================
     TECHNOLOGIES
  ===================================================== */

  const technologies =
    useMemo(() => {
      const categories =
        Array.from(
          new Set(
            questions.map(
              (question) =>
                question.category
            )
          )
        ).sort();

      return [
        {
          name:
            "All technologies",

          icon:
            "✦",

          subtitle:
            "Browse everything",
        },

        ...categories.map(
          (category) => ({
            name:
              category,

            icon:
              category
                .substring(
                  0,
                  2
                )
                .toUpperCase(),

            subtitle:
              "Interview questions",
          })
        ),
      ];
    }, [questions]);

  /* =====================================================
     TOPICS
  ===================================================== */

  const topics =
    useMemo(() => {
      const relevant =
        questions.filter(
          (question) =>
            technology ===
              "All technologies" ||
            question.category ===
              technology
        );

      return [
        "All topics",

        ...Array.from(
          new Set(
            relevant.map(
              (question) =>
                question.topic
            )
          )
        ).sort(),
      ];
    }, [
      questions,
      technology,
    ]);

  /* =====================================================
     FILTER QUESTIONS
  ===================================================== */

  const filteredQuestions =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return questions.filter(
        (question) => {
          const technologyMatch =
            technology ===
              "All technologies" ||
            question.category ===
              technology;

          const difficultyMatch =
            difficulty ===
              "All levels" ||
            question.difficulty ===
              difficulty;

          const topicMatch =
            topic ===
              "All topics" ||
            question.topic ===
              topic;

          const searchMatch =
            !term ||
            `${question.question} ${question.answer} ${question.category} ${question.topic}`
              .toLowerCase()
              .includes(term);

          const savedMatch =
            !showSavedOnly ||
            saved.includes(
              question._id
            );

          return (
            technologyMatch &&
            difficultyMatch &&
            topicMatch &&
            searchMatch &&
            savedMatch
          );
        }
      );
    }, [
      questions,
      technology,
      difficulty,
      topic,
      search,
      saved,
      showSavedOnly,
    ]);

  /* =====================================================
     AI TECHNOLOGY
  ===================================================== */

  const handleAITechnologyChange =
    (
      value: string
    ) => {
      setAiTechnology(
        value
      );

      setAiTopic(
        "General"
      );
    };

  /* =====================================================
     FALLBACK CHECK
  ===================================================== */

  const isFallbackQuestion =
    (id: string) =>
      id.startsWith(
        "fallback-"
      );

  /* =====================================================
     COMPLETED
  ===================================================== */

  const toggleCompleted =
    async (
      id: string
    ) => {
      if (
        isFallbackQuestion(
          id
        )
      ) {
        setCompleted(
          (previous) =>
            previous.includes(
              id
            )
              ? previous.filter(
                  (item) =>
                    item !==
                    id
                )
              : [
                  ...previous,
                  id,
                ]
        );

        return;
      }

      try {
        const response =
          await toggleCompletedQuestion(
            id
          );

        if (
          response.success
        ) {
          setCompleted(
            response.progress
              .completedQuestions
          );
        }
      } catch (err) {
        console.error(
          err
        );
      }
    };

  /* =====================================================
     BOOKMARK
  ===================================================== */

  const toggleSaved =
    async (
      id: string
    ) => {
      if (
        isFallbackQuestion(
          id
        )
      ) {
        setSaved(
          (previous) =>
            previous.includes(
              id
            )
              ? previous.filter(
                  (item) =>
                    item !==
                    id
                )
              : [
                  ...previous,
                  id,
                ]
        );

        return;
      }

      try {
        const response =
          await toggleBookmarkQuestion(
            id
          );

        if (
          response.success
        ) {
          setSaved(
            response.progress
              .bookmarkedQuestions
          );
        }
      } catch (err) {
        console.error(
          err
        );
      }
    };

  /* =====================================================
     AI GENERATION
  ===================================================== */

  const handleGenerateAIQuestions =
    async () => {
      try {
        setIsGeneratingAI(
          true
        );

        setAiMessage("");

        setAiMessageType("");

        setExpandedId(null);

        const response =
          await generateAIQuestions(
            {
              technology:
                aiTechnology,

              topic:
                aiTopic,

              difficulty:
                aiDifficulty,

              experience,

              questionCount:
                aiQuestionCount,
            }
          );

        /*
         * Backend has already saved
         * these questions in MongoDB.
         */

        if (
          response.success &&
          response.questions
            .length > 0
        ) {
          /*
           * Reload complete MongoDB bank.
           *
           * This keeps manual + previous AI +
           * newly generated AI questions together.
           */

          await loadQuestionBank();

          setTechnology(
            aiTechnology
          );

          setDifficulty(
            "All levels"
          );

          setTopic(
            "All topics"
          );

          setSearch("");

          setShowSavedOnly(
            false
          );

          setAiMessageType(
            "success"
          );

          setAiMessage(
            `${response.questions.length} new question${
              response.questions
                .length === 1
                ? ""
                : "s"
            } generated and saved to your question bank.`
          );

          return;
        }

        /*
         * Usually means generated questions
         * already existed.
         */

        await loadQuestionBank();

        setAiMessageType(
          "error"
        );

        setAiMessage(
          response.message ||
            "No new questions were added because similar questions already exist."
        );
      } catch (err) {
        console.error(
          "AI generation:",
          err
        );

        /*
         * AI unavailable:
         * use MongoDB question bank.
         */

        try {
          await loadQuestionBank();

          setAiMessageType(
            "error"
          );

          setAiMessage(
            "AI is currently unavailable. Your saved database questions are still available for practice."
          );
        } catch {
          setQuestions(
            fallbackQuestions
          );

          setAiMessageType(
            "error"
          );

          setAiMessage(
            "AI and the database are currently unavailable. Default questions are being shown."
          );
        }
      } finally {
        setIsGeneratingAI(
          false
        );
      }
    };

  /* =====================================================
     RESET
  ===================================================== */

  const resetFilters =
    () => {
      setTechnology(
        "All technologies"
      );

      setDifficulty(
        "All levels"
      );

      setTopic(
        "All topics"
      );

      setSearch("");

      setShowSavedOnly(
        false
      );
    };

  /* =====================================================
     PROGRESS
  ===================================================== */

  const databaseQuestionIds =
    useMemo(
      () =>
        new Set(
          questions
            .filter(
              (question) =>
                !isFallbackQuestion(
                  question._id
                )
            )
            .map(
              (question) =>
                question._id
            )
        ),
      [questions]
    );

  const completedCount =
    completed.filter(
      (id) =>
        databaseQuestionIds.has(
          id
        ) ||
        questions.some(
          (question) =>
            question._id ===
            id
        )
    ).length;

  const bookmarkedCount =
    saved.filter(
      (id) =>
        databaseQuestionIds.has(
          id
        ) ||
        questions.some(
          (question) =>
            question._id ===
            id
        )
    ).length;

  const progress =
    questions.length > 0
      ? Math.min(
          100,
          Math.round(
            (completedCount /
              questions.length) *
              100
          )
        )
      : 0;

  /* =====================================================
     UI
  ===================================================== */

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#080b14] text-slate-100">
        <Sidebar
          open={
            sidebarOpen
          }
          onClose={() =>
            setSidebarOpen(
              false
            )
          }
        />

        <div className="min-h-screen lg:pl-64">
          <Topbar
            onMenuClick={() =>
              setSidebarOpen(
                true
              )
            }
          />

          <main className="mx-auto max-w-[1500px] px-4 pb-12 pt-6 sm:px-6 lg:px-8">
            {/* HEADING */}

            <div className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
                  <Sparkles
                    size={
                      14
                    }
                  />

                  YOUR NEXT
                  INTERVIEW
                  STARTS HERE
                </div>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Interview
                  Preparation
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                  Practice
                  database
                  questions and
                  generate new AI
                  questions to
                  continuously grow
                  your interview
                  question bank.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111624] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                  <Target
                    size={
                      22
                    }
                  />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Your
                    progress
                  </p>

                  <p className="mt-1 text-xl font-semibold">
                    {
                      completedCount
                    }

                    <span className="text-sm font-normal text-slate-500">
                      {" "}
                      /{" "}
                      {
                        questions.length
                      }{" "}
                      questions
                    </span>
                  </p>

                  <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>

                <span className="text-sm font-semibold text-violet-300">
                  {
                    progress
                  }
                  %
                </span>
              </div>
            </div>

            {/* STATISTICS */}

            <section className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label:
                    "Available questions",

                  value:
                    questions.length,

                  icon:
                    BookOpen,

                  color:
                    "text-sky-300 bg-sky-400/10",
                },

                {
                  label:
                    "Technologies",

                  value:
                    Math.max(
                      technologies.length -
                        1,
                      0
                    ),

                  icon:
                    Code2,

                  color:
                    "text-violet-300 bg-violet-400/10",
                },

                {
                  label:
                    "Completed",

                  value:
                    completedCount,

                  icon:
                    CheckCircle2,

                  color:
                    "text-emerald-300 bg-emerald-400/10",
                },

                {
                  label:
                    "Bookmarked",

                  value:
                    bookmarkedCount,

                  icon:
                    BookmarkCheck,

                  color:
                    "text-amber-300 bg-amber-400/10",
                },
              ].map(
                (
                  stat
                ) => {
                  const Icon =
                    stat.icon;

                  return (
                    <div
                      key={
                        stat.label
                      }
                      className="rounded-2xl border border-white/[0.08] bg-[#111624] p-4 sm:p-5"
                    >
                      <div
                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                      >
                        <Icon
                          size={
                            19
                          }
                        />
                      </div>

                      <p className="text-2xl font-bold">
                        {
                          stat.value
                        }
                      </p>

                      <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                        {
                          stat.label
                        }
                      </p>
                    </div>
                  );
                }
              )}
            </section>

            {/* AI GENERATOR */}

            <section className="mb-7 overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.10] via-[#111624] to-[#111624] p-5 sm:p-6">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                  <WandSparkles
                    size={
                      19
                    }
                  />
                </div>

                <div>
                  <h2 className="font-semibold">
                    AI Question
                    Generator
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">
                    Generate new
                    questions and
                    automatically
                    save them to
                    your MongoDB
                    question bank.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {/* TECHNOLOGY */}

                <label>
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">
                    Technology
                  </span>

                  <select
                    value={
                      aiTechnology
                    }
                    onChange={(
                      event
                    ) =>
                      handleAITechnologyChange(
                        event
                          .target
                          .value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0a0e18] px-3 py-3 text-sm text-slate-300 outline-none focus:border-violet-500/50"
                  >
                    {aiTechnologyOptions.map(
                      (
                        item
                      ) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                          className="bg-[#111624]"
                        >
                          {
                            item
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>

                {/* TOPIC */}

                <label>
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">
                    Topic
                  </span>

                  <select
                    value={
                      aiTopic
                    }
                    onChange={(
                      event
                    ) =>
                      setAiTopic(
                        event
                          .target
                          .value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0a0e18] px-3 py-3 text-sm text-slate-300 outline-none focus:border-violet-500/50"
                  >
                    {(
                      aiTopicOptions[
                        aiTechnology
                      ] ?? [
                        "General",
                      ]
                    ).map(
                      (
                        item
                      ) => (
                        <option
                          key={
                            item
                          }
                          value={
                            item
                          }
                          className="bg-[#111624]"
                        >
                          {
                            item
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>

                {/* DIFFICULTY */}

                <label>
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">
                    Difficulty
                  </span>

                  <select
                    value={
                      aiDifficulty
                    }
                    onChange={(
                      event
                    ) =>
                      setAiDifficulty(
                        event
                          .target
                          .value as AIDifficulty
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0a0e18] px-3 py-3 text-sm text-slate-300 outline-none focus:border-violet-500/50"
                  >
                    <option
                      value="Easy"
                      className="bg-[#111624]"
                    >
                      Easy
                    </option>

                    <option
                      value="Medium"
                      className="bg-[#111624]"
                    >
                      Medium
                    </option>

                    <option
                      value="Hard"
                      className="bg-[#111624]"
                    >
                      Hard
                    </option>
                  </select>
                </label>

                {/* EXPERIENCE */}

                <label>
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">
                    Experience
                  </span>

                  <select
                    value={
                      experience
                    }
                    onChange={(
                      event
                    ) =>
                      setExperience(
                        event
                          .target
                          .value
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0a0e18] px-3 py-3 text-sm text-slate-300 outline-none focus:border-violet-500/50"
                  >
                    <option
                      value="Fresher"
                      className="bg-[#111624]"
                    >
                      Fresher
                    </option>

                    <option
                      value="0-1 years"
                      className="bg-[#111624]"
                    >
                      0-1 years
                    </option>

                    <option
                      value="1-3 years"
                      className="bg-[#111624]"
                    >
                      1-3 years
                    </option>

                    <option
                      value="3-5 years"
                      className="bg-[#111624]"
                    >
                      3-5 years
                    </option>

                    <option
                      value="5+ years"
                      className="bg-[#111624]"
                    >
                      5+ years
                    </option>
                  </select>
                </label>

                {/* COUNT */}

                <label>
                  <span className="mb-1.5 block text-xs font-medium text-slate-400">
                    Questions
                  </span>

                  <select
                    value={
                      aiQuestionCount
                    }
                    onChange={(
                      event
                    ) =>
                      setAiQuestionCount(
                        Number(
                          event
                            .target
                            .value
                        )
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-[#0a0e18] px-3 py-3 text-sm text-slate-300 outline-none focus:border-violet-500/50"
                  >
                    <option
                      value={
                        1
                      }
                    >
                      1
                    </option>

                    <option
                      value={
                        5
                      }
                    >
                      5
                    </option>

                    <option
                      value={
                        10
                      }
                    >
                      10
                    </option>

                    <option
                      value={
                        15
                      }
                    >
                      15
                    </option>

                    <option
                      value={
                        20
                      }
                    >
                      20
                    </option>
                  </select>
                </label>
              </div>

              {/* SUMMARY */}

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  aiTechnology,
                  aiTopic,
                  aiDifficulty,
                  experience,
                  `${aiQuestionCount} ${
                    aiQuestionCount ===
                    1
                      ? "question"
                      : "questions"
                  }`,
                ].map(
                  (
                    item
                  ) => (
                    <span
                      key={
                        item
                      }
                      className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-2.5 py-1.5 text-xs text-slate-300"
                    >
                      {
                        item
                      }
                    </span>
                  )
                )}
              </div>

              {/* GENERATE */}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={
                    handleGenerateAIQuestions
                  }
                  disabled={
                    isGeneratingAI
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2
                        size={
                          17
                        }
                        className="animate-spin"
                      />

                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles
                        size={
                          17
                        }
                      />

                      Generate &
                      Save
                    </>
                  )}
                </button>

                <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                  <Database
                    size={
                      14
                    }
                  />

                  Generated
                  questions are
                  automatically
                  added to the
                  question bank.
                </div>
              </div>

              {aiMessage && (
                <div
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                    aiMessageType ===
                    "success"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-200"
                  }`}
                >
                  {
                    aiMessage
                  }
                </div>
              )}
            </section>

            {/* QUESTION BANK */}

            <div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
              {/* TECHNOLOGIES */}

              <aside className="rounded-2xl border border-white/[0.08] bg-[#111624] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold">
                    Technologies
                  </h2>

                  <Code2
                    size={
                      17
                    }
                    className="text-slate-500"
                  />
                </div>

                <div className="space-y-1.5">
                  {technologies.map(
                    (
                      item
                    ) => {
                      const active =
                        technology ===
                        item.name;

                      const count =
                        item.name ===
                        "All technologies"
                          ? questions.length
                          : questions.filter(
                              (
                                question
                              ) =>
                                question.category ===
                                item.name
                            )
                              .length;

                      return (
                        <button
                          key={
                            item.name
                          }
                          type="button"
                          onClick={() => {
                            setTechnology(
                              item.name
                            );

                            setTopic(
                              "All topics"
                            );
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
                            {
                              item.icon
                            }
                          </span>

                          <span className="min-w-0 flex-1">
                            <span
                              className={`block truncate text-sm font-medium ${
                                active
                                  ? "text-violet-200"
                                  : "text-slate-200"
                              }`}
                            >
                              {
                                item.name
                              }
                            </span>

                            <span className="mt-0.5 block text-xs text-slate-500">
                              {
                                item.subtitle
                              }
                            </span>
                          </span>

                          <span className="text-xs text-slate-500">
                            {
                              count
                            }
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="mt-5 rounded-xl border border-violet-500/15 bg-violet-500/[0.06] p-4">
                  <Database
                    size={
                      17
                    }
                    className="mb-2 text-violet-300"
                  />

                  <p className="text-sm font-medium">
                    Growing
                    Question Bank
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    AI-generated
                    questions are
                    stored here
                    with your
                    existing
                    questions.
                  </p>
                </div>
              </aside>

              {/* QUESTIONS */}

              <section className="min-w-0">
                {/* FILTERS */}

                <div className="mb-4 rounded-2xl border border-white/[0.08] bg-[#111624] p-4 sm:p-5">
                  <div className="flex flex-col gap-3 lg:flex-row">
                    <label className="relative flex-1">
                      <Search
                        size={
                          18
                        }
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                      />

                      <input
                        value={
                          search
                        }
                        onChange={(
                          event
                        ) =>
                          setSearch(
                            event
                              .target
                              .value
                          )
                        }
                        placeholder="Search questions, topics, answers..."
                        className="w-full rounded-xl border border-white/10 bg-[#0a0e18] py-3 pl-11 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-violet-500/50"
                      />
                    </label>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0a0e18] px-3">
                        <Filter
                          size={
                            15
                          }
                          className="text-slate-500"
                        />

                        <select
                          value={
                            difficulty
                          }
                          onChange={(
                            event
                          ) =>
                            setDifficulty(
                              event
                                .target
                                .value
                            )
                          }
                          className="w-full bg-transparent py-3 text-sm text-slate-300 outline-none"
                        >
                          <option value="All levels">
                            All levels
                          </option>

                          <option value="Easy">
                            Easy
                          </option>

                          <option value="Medium">
                            Medium
                          </option>

                          <option value="Hard">
                            Hard
                          </option>
                        </select>
                      </label>

                      <label className="rounded-xl border border-white/10 bg-[#0a0e18] px-3">
                        <select
                          value={
                            topic
                          }
                          onChange={(
                            event
                          ) =>
                            setTopic(
                              event
                                .target
                                .value
                            )
                          }
                          className="w-full min-w-36 bg-transparent py-3 text-sm text-slate-300 outline-none"
                        >
                          {topics.map(
                            (
                              item
                            ) => (
                              <option
                                key={
                                  item
                                }
                                value={
                                  item
                                }
                              >
                                {
                                  item
                                }
                              </option>
                            )
                          )}
                        </select>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-400">
                      <span className="font-semibold text-slate-200">
                        {
                          filteredQuestions.length
                        }
                      </span>{" "}
                      questions
                      found
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setShowSavedOnly(
                          (
                            value
                          ) =>
                            !value
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        showSavedOnly
                          ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                          : "border-white/10 text-slate-400 hover:bg-white/[0.04]"
                      }`}
                    >
                      <BookmarkCheck
                        size={
                          15
                        }
                      />

                      {showSavedOnly
                        ? "Showing saved"
                        : "Saved questions only"}
                    </button>
                  </div>
                </div>

                {/* LOADING */}

                {isLoading && (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#111624] p-10 text-center">
                    <Loader2
                      size={
                        24
                      }
                      className="mx-auto mb-3 animate-spin text-violet-300"
                    />

                    <p className="text-sm text-slate-400">
                      Loading
                      interview
                      questions...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {
                      error
                    }
                  </div>
                )}

                {/* CARDS */}

                <div className="space-y-3">
                  {!isLoading &&
                    filteredQuestions.map(
                      (
                        question,
                        index
                      ) => {
                        const isExpanded =
                          expandedId ===
                          question._id;

                        const isCompleted =
                          completed.includes(
                            question._id
                          );

                        const isSaved =
                          saved.includes(
                            question._id
                          );

                        return (
                          <article
                            key={
                              question._id
                            }
                            className={`overflow-hidden rounded-2xl border bg-[#111624] transition ${
                              isExpanded
                                ? "border-violet-500/25"
                                : "border-white/[0.08]"
                            }`}
                          >
                            <div className="flex items-start gap-3 p-4 sm:p-5">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleCompleted(
                                    question._id
                                  )
                                }
                                className="mt-0.5 shrink-0 text-slate-500 hover:text-emerald-300"
                              >
                                {isCompleted ? (
                                  <CheckCircle2
                                    size={
                                      21
                                    }
                                    className="text-emerald-300"
                                  />
                                ) : (
                                  <Circle
                                    size={
                                      21
                                    }
                                  />
                                )}
                              </button>

                              <button
                                type="button"
                                className="min-w-0 flex-1 text-left"
                                onClick={() =>
                                  setExpandedId(
                                    isExpanded
                                      ? null
                                      : question._id
                                  )
                                }
                              >
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
                                    Question{" "}
                                    {String(
                                      index +
                                        1
                                    ).padStart(
                                      2,
                                      "0"
                                    )}
                                  </span>

                                  <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-slate-400">
                                    {
                                      question.category
                                    }
                                  </span>

                                  <span
                                    className={`rounded-md border px-2 py-1 text-[11px] ${difficultyStyles[question.difficulty]}`}
                                  >
                                    {
                                      question.difficulty
                                    }
                                  </span>

                                  {question.source ===
                                    "ai" && (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-1 text-[11px] text-violet-300">
                                      <Sparkles
                                        size={
                                          10
                                        }
                                      />

                                      AI
                                    </span>
                                  )}

                                  {question.source !==
                                    "ai" &&
                                    !isFallbackQuestion(
                                      question._id
                                    ) && (
                                      <span className="inline-flex items-center gap-1 rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-[11px] text-sky-300">
                                        <Database
                                          size={
                                            10
                                          }
                                        />

                                        Question
                                        Bank
                                      </span>
                                    )}

                                  {isFallbackQuestion(
                                    question._id
                                  ) && (
                                    <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-300">
                                      Default
                                    </span>
                                  )}
                                </div>

                                <h3
                                  className={`text-sm font-semibold leading-6 sm:text-base ${
                                    isCompleted
                                      ? "text-slate-400"
                                      : "text-slate-100"
                                  }`}
                                >
                                  {
                                    question.question
                                  }
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                  {
                                    question.topic
                                  }
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  toggleSaved(
                                    question._id
                                  )
                                }
                                className={`rounded-lg p-2 transition ${
                                  isSaved
                                    ? "text-amber-300"
                                    : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-200"
                                }`}
                              >
                                <BookmarkCheck
                                  size={
                                    18
                                  }
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedId(
                                    isExpanded
                                      ? null
                                      : question._id
                                  )
                                }
                                className="rounded-lg p-2 text-slate-500 hover:bg-white/[0.05]"
                              >
                                {isExpanded ? (
                                  <ChevronUp
                                    size={
                                      18
                                    }
                                  />
                                ) : (
                                  <ChevronDown
                                    size={
                                      18
                                    }
                                  />
                                )}
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="border-t border-white/[0.07] px-4 pb-5 pt-4 sm:px-5 sm:pl-14">
                                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-300">
                                  <BookOpen
                                    size={
                                      14
                                    }
                                  />

                                  Answer
                                </div>

                                <p className="text-sm leading-7 text-slate-300">
                                  {
                                    question.answer
                                  }
                                </p>

                                {question.tags &&
                                  question.tags
                                    .length >
                                    0 && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                      {question.tags.map(
                                        (
                                          tag
                                        ) => (
                                          <span
                                            key={
                                              tag
                                            }
                                            className="rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-slate-500"
                                          >
                                            #
                                            {
                                              tag
                                            }
                                          </span>
                                        )
                                      )}
                                    </div>
                                  )}

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                                    <Clock3
                                      size={
                                        13
                                      }
                                    />

                                    Suggested
                                    review:
                                    2–4 min
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleCompleted(
                                        question._id
                                      )
                                    }
                                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                      isCompleted
                                        ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                                        : "bg-violet-600 text-white hover:bg-violet-500"
                                    }`}
                                  >
                                    <CheckCircle2
                                      size={
                                        15
                                      }
                                    />

                                    {isCompleted
                                      ? "Mark incomplete"
                                      : "Mark as completed"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </article>
                        );
                      }
                    )}

                  {/* EMPTY */}

                  {!isLoading &&
                    filteredQuestions.length ===
                      0 && (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-[#111624] px-6 py-14 text-center">
                        <Search
                          size={
                            28
                          }
                          className="mx-auto mb-3 text-slate-600"
                        />

                        <h3 className="font-semibold">
                          No
                          questions
                          found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                          Try
                          another
                          filter or
                          reset your
                          filters.
                        </p>

                        <button
                          type="button"
                          onClick={
                            resetFilters
                          }
                          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
                        >
                          Reset
                          filters
                        </button>
                      </div>
                    )}
                </div>

                <p className="mt-5 text-center text-xs leading-5 text-slate-600">
                  AI-generated
                  questions are
                  saved to the
                  question bank so
                  you can continue
                  practicing even
                  when AI generation
                  is unavailable.
                </p>
              </section>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
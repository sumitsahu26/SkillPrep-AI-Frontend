"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  Trophy,
  Clock3,
  Target,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Code2,
} from "lucide-react";
import AuthGuard from "../components/AuthGuard";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
};

const questions: Question[] = [
  {
    id: 1,
    question: "Which keyword is used to declare a block-scoped variable?",
    options: ["var", "let", "function", "define"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which React Hook is used to manage component state?",
    options: ["useEffect", "useContext", "useState", "useMemo"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "What is the purpose of the Node.js event loop?",
    options: [
      "Create HTML pages",
      "Handle asynchronous operations",
      "Connect only to MongoDB",
      "Compile React components",
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Which MongoDB method is commonly used to retrieve documents?",
    options: ["select()", "get()", "find()", "fetch()"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "What does JWT commonly provide in a web application?",
    options: [
      "Database indexing",
      "Authentication information",
      "CSS styling",
      "Image optimization",
    ],
    correctAnswer: 1,
  },
];

export default function SkillAssessmentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [started, setStarted] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState<
    Record<number, number>
  >({});

  const [finished, setFinished] = useState(false);

  const selectAnswer = (optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: optionIndex,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      if (answers[index] === question.correctAnswer) {
        return score + 1;
      }

      return score;
    }, 0);
  };

  const restartQuiz = () => {
    setStarted(false);
    setFinished(false);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const score = calculateScore();

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  return (
<AuthGuard>
<div className="min-h-screen bg-[#080c14] text-white">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 md:p-6 lg:p-8">
          {/* HEADER */}

          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2 text-purple-400">
              <BrainCircuit size={18} />

              <span className="text-sm font-medium">
                Test Your Knowledge
              </span>
            </div>

            <h1 className="text-3xl font-bold">
              Skill Assessment
            </h1>

            <p className="mt-2 text-gray-400">
              Test your technical knowledge and identify areas
              where you need improvement.
            </p>
          </div>

          {!started ? (
            /* START SCREEN */

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-2xl border border-gray-800 bg-[#101722] p-6 lg:col-span-2">
                <div className="mb-7 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-500/10">
                    <Code2 className="text-purple-400" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold">
                      MERN Stack Assessment
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                      JavaScript, React, Node.js and MongoDB
                    </p>
                  </div>
                </div>

                <div className="mb-8 grid gap-4 sm:grid-cols-3">
                  <InfoCard
                    icon={<Target size={20} />}
                    title={`${questions.length} Questions`}
                    text="Multiple choice"
                  />

                  <InfoCard
                    icon={<Clock3 size={20} />}
                    title="10 Minutes"
                    text="Recommended time"
                  />

                  <InfoCard
                    icon={<Trophy size={20} />}
                    title="70% Score"
                    text="Recommended passing"
                  />
                </div>

                <button
                  onClick={() => setStarted(true)}
                  className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold transition hover:bg-purple-700"
                >
                  Start Assessment
                </button>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-[#101722] p-6">
                <h3 className="mb-5 font-semibold">
                  Assessment Topics
                </h3>

                <div className="space-y-4">
                  {[
                    "JavaScript",
                    "React.js",
                    "Node.js",
                    "Express.js",
                    "MongoDB",
                  ].map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2
                        size={17}
                        className="text-green-400"
                      />

                      <span className="text-sm text-gray-400">
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : finished ? (
            /* RESULT */

            <div className="mx-auto max-w-3xl">
              <div className="rounded-2xl border border-gray-800 bg-[#101722] p-6 text-center md:p-8">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10">
                  <Trophy
                    size={30}
                    className="text-purple-400"
                  />
                </div>

                <p className="text-sm text-gray-400">
                  Your Score
                </p>

                <h2 className="mt-2 text-5xl font-bold">
                  {percentage}%
                </h2>

                <p className="mt-3 text-gray-400">
                  You answered {score} out of{" "}
                  {questions.length} questions correctly.
                </p>

                <div className="mt-6">
                  {percentage >= 70 ? (
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
                      <CheckCircle2 size={17} />
                      Assessment Passed
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm text-orange-400">
                      <Target size={17} />
                      Keep Practicing
                    </div>
                  )}
                </div>

                <button
                  onClick={restartQuiz}
                  className="mx-auto mt-7 flex items-center gap-2 rounded-xl border border-gray-700 px-5 py-2.5 text-sm hover:bg-gray-800"
                >
                  <RotateCcw size={16} />
                  Retake Assessment
                </button>
              </div>

              {/* ANSWER REVIEW */}

              <div className="mt-6 space-y-4">
                <h2 className="text-lg font-semibold">
                  Answer Review
                </h2>

                {questions.map((question, index) => {
                  const selectedAnswer = answers[index];

                  const correct =
                    selectedAnswer ===
                    question.correctAnswer;

                  return (
                    <div
                      key={question.id}
                      className="rounded-xl border border-gray-800 bg-[#101722] p-5"
                    >
                      <div className="flex items-start gap-3">
                        {correct ? (
                          <CheckCircle2
                            size={20}
                            className="mt-0.5 shrink-0 text-green-400"
                          />
                        ) : (
                          <XCircle
                            size={20}
                            className="mt-0.5 shrink-0 text-red-400"
                          />
                        )}

                        <div>
                          <p className="font-medium">
                            {question.question}
                          </p>

                          <p className="mt-3 text-sm text-gray-400">
                            Your answer:{" "}
                            <span
                              className={
                                correct
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {selectedAnswer !== undefined
                                ? question.options[
                                    selectedAnswer
                                  ]
                                : "Not answered"}
                            </span>
                          </p>

                          {!correct && (
                            <p className="mt-2 text-sm text-gray-400">
                              Correct answer:{" "}
                              <span className="text-green-400">
                                {
                                  question.options[
                                    question.correctAnswer
                                  ]
                                }
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* QUESTION SCREEN */

            <div className="mx-auto max-w-4xl">
              <div className="mb-5 rounded-xl border border-gray-800 bg-[#101722] p-4">
                <div className="mb-3 flex justify-between text-sm">
                  <span className="text-gray-400">
                    Question {currentQuestion + 1} of{" "}
                    {questions.length}
                  </span>

                  <span className="text-purple-400">
                    {Math.round(
                      ((currentQuestion + 1) /
                        questions.length) *
                        100
                    )}
                    %
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                  <div
                    className="h-full bg-purple-600 transition-all duration-300"
                    style={{
                      width: `${
                        ((currentQuestion + 1) /
                          questions.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-[#101722] p-6 md:p-8">
                <span className="rounded-full bg-purple-500/10 px-3 py-1.5 text-xs text-purple-400">
                  MERN Stack
                </span>

                <h2 className="mt-5 text-xl font-semibold leading-8">
                  {questions[currentQuestion].question}
                </h2>

                <div className="mt-7 space-y-3">
                  {questions[currentQuestion].options.map(
                    (option, index) => {
                      const selected =
                        answers[currentQuestion] === index;

                      return (
                        <button
                          key={option}
                          onClick={() =>
                            selectAnswer(index)
                          }
                          className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                            selected
                              ? "border-purple-500 bg-purple-500/10 text-purple-200"
                              : "border-gray-800 bg-[#0b111b] text-gray-300 hover:border-gray-700"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${
                              selected
                                ? "border-purple-500 bg-purple-600 text-white"
                                : "border-gray-700"
                            }`}
                          >
                            {String.fromCharCode(
                              65 + index
                            )}
                          </div>

                          <span className="text-sm">
                            {option}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-gray-800 pt-5">
                  <button
                    disabled={currentQuestion === 0}
                    onClick={previousQuestion}
                    className="flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>

                  <button
                    disabled={
                      answers[currentQuestion] === undefined
                    }
                    onClick={nextQuestion}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {currentQuestion ===
                    questions.length - 1
                      ? "Finish Assessment"
                      : "Next Question"}

                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
</AuthGuard>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-[#0b111b] p-4">
      <div className="mb-3 text-purple-400">
        {icon}
      </div>

      <p className="text-sm font-medium">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {text}
      </p>
    </div>
  );
}
"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  BrainCircuit,
  Play,
  Send,
  RotateCcw,
  Clock3,
  Target,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Menu
} from "lucide-react";
import AuthGuard from "../components/AuthGuard";

const questions = [
  "Tell me about yourself and your experience as a MERN Stack Developer.",
  "What is the Node.js event loop?",
  "What is the difference between useMemo and useCallback in React?",
  "How would you optimize a slow MongoDB query?",
  "How do you handle authentication in a MERN application?",
];

export default function MockInterviewPage() {
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const currentQuestion = questions[questionIndex];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const startInterview = () => {
    setStarted(true);
    setQuestionIndex(0);
    setAnswer("");
    setSubmitted(false);
  };

  const submitAnswer = () => {
    if (!answer.trim()) return;

    setSubmitted(true);
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((prev) => prev + 1);
      setAnswer("");
      setSubmitted(false);
    }
  };

  const restartInterview = () => {
    setStarted(false);
    setQuestionIndex(0);
    setAnswer("");
    setSubmitted(false);
  };

  return (
<AuthGuard>
<div className="min-h-screen bg-[#080c14] text-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
      <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}

          <div className="mb-8">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Sparkles size={18} />
              <span className="text-sm font-medium">
                AI Powered Practice
              </span>
            </div>

            <h1 className="text-3xl font-bold mb-2">
              AI Mock Interview
            </h1>

            <p className="text-gray-400">
              Practice technical interview questions and improve your
              interview performance.
            </p>
          </div>

          {!started ? (
            <>
              {/* Interview Setup */}

              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#101722] border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                      <BrainCircuit className="text-purple-400" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold">
                        Technical Interview
                      </h2>

                      <p className="text-sm text-gray-400">
                        MERN Stack Developer
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-[#0b111b] border border-gray-800 rounded-xl p-4">
                      <Clock3 className="text-blue-400 mb-3" />

                      <p className="font-medium">30 Minutes</p>

                      <p className="text-xs text-gray-500 mt-1">
                        Interview duration
                      </p>
                    </div>

                    <div className="bg-[#0b111b] border border-gray-800 rounded-xl p-4">
                      <MessageSquare className="text-green-400 mb-3" />

                      <p className="font-medium">
                        {questions.length} Questions
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Technical questions
                      </p>
                    </div>

                    <div className="bg-[#0b111b] border border-gray-800 rounded-xl p-4">
                      <Target className="text-orange-400 mb-3" />

                      <p className="font-medium">Intermediate</p>

                      <p className="text-xs text-gray-500 mt-1">
                        Difficulty level
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={startInterview}
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-xl font-medium"
                  >
                    <Play size={18} />
                    Start Mock Interview
                  </button>
                </div>

                {/* Instructions */}

                <div className="bg-[#101722] border border-gray-800 rounded-2xl p-6">
                  <h3 className="font-semibold mb-5">
                    Interview Instructions
                  </h3>

                  <div className="space-y-4">
                    {[
                      "Answer questions clearly.",
                      "Explain your approach.",
                      "Give practical examples.",
                      "Mention project experience.",
                      "Review AI feedback.",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          size={17}
                          className="text-green-400 mt-0.5 shrink-0"
                        />

                        <p className="text-sm text-gray-400">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Progress */}

              <div className="bg-[#101722] border border-gray-800 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">
                    Interview Progress
                  </span>

                  <span>
                    {questionIndex + 1} / {questions.length}
                  </span>
                </div>

                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full transition-all"
                    style={{
                      width: `${
                        ((questionIndex + 1) / questions.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Question */}

                <div className="lg:col-span-2 bg-[#101722] border border-gray-800 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full">
                      Question {questionIndex + 1}
                    </span>

                    <span className="text-xs text-gray-500">
                      Technical Interview
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold leading-relaxed mb-6">
                    {currentQuestion}
                  </h2>

                  <textarea
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      setSubmitted(false);
                    }}
                    placeholder="Type your interview answer here..."
                    className="w-full h-52 bg-[#0b111b] border border-gray-700 rounded-xl p-4 outline-none focus:border-purple-500 resize-none text-sm"
                  />

                  <div className="flex flex-wrap gap-3 mt-5">
                    {!submitted ? (
                      <button
                        onClick={submitAnswer}
                        disabled={!answer.trim()}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 rounded-lg text-sm font-medium"
                      >
                        <Send size={16} />
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={nextQuestion}
                        disabled={
                          questionIndex === questions.length - 1
                        }
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-40 px-5 py-2.5 rounded-lg text-sm"
                      >
                        Next Question
                      </button>
                    )}

                    <button
                      onClick={restartInterview}
                      className="flex items-center gap-2 border border-gray-700 hover:bg-gray-800 px-5 py-2.5 rounded-lg text-sm"
                    >
                      <RotateCcw size={16} />
                      Exit Interview
                    </button>
                  </div>
                </div>

                {/* Feedback */}

                <div className="bg-[#101722] border border-gray-800 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <BrainCircuit
                      size={19}
                      className="text-purple-400"
                    />

                    <h3 className="font-semibold">
                      AI Feedback
                    </h3>
                  </div>

                  {!submitted ? (
                    <div className="text-center py-10">
                      <BrainCircuit
                        size={40}
                        className="mx-auto text-gray-700 mb-4"
                      />

                      <p className="text-sm text-gray-500">
                        Submit your answer to receive AI feedback.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          Answer Score
                        </p>

                        <div className="flex items-end gap-1">
                          <span className="text-3xl font-bold text-green-400">
                            8
                          </span>

                          <span className="text-gray-500 mb-1">
                            /10
                          </span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Feedback
                        </p>

                        <p className="text-sm text-gray-400 leading-6">
                          Good explanation. Try adding a
                          practical example from one of your
                          projects to make the answer stronger.
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Improvements
                        </p>

                        <ul className="text-sm text-gray-400 space-y-2">
                          <li>• Explain the concept clearly.</li>
                          <li>• Add a real-world example.</li>
                          <li>• Mention performance impact.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
</AuthGuard>
  );
}
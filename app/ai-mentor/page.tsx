"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Bot,
  Send,
  User,
  Sparkles,
  Code2,
  FileText,
  BriefcaseBusiness,
  BrainCircuit,
  Trash2,
  Loader2,
} from "lucide-react";
import AuthGuard from "../components/AuthGuard";
import {
  clearMentorHistory,
  getMentorHistory,
  sendMentorMessage,
} from "@/services/aiMentorApi";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  {
    icon: Code2,
    title: "Technical Question",
    prompt: "Explain the Node.js event loop in simple words.",
  },
  {
    icon: FileText,
    title: "Resume Help",
    prompt: "How can I improve my Full Stack Developer resume?",
  },
  {
    icon: BriefcaseBusiness,
    title: "Career Advice",
    prompt: "What should I learn next as a MERN Stack Developer?",
  },
  {
    icon: BrainCircuit,
    title: "Interview Help",
    prompt: "Ask me a Node.js interview question.",
  },
];

export default function AIMentorPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [input, setInput] = useState("");

  const welcomeMessage: Message = {
    id: "welcome",

    role: "assistant",

    content:
      "Hi! I'm your SkillPrep AI Mentor. Ask me about interviews, resumes, MERN Stack, system design, career preparation, or technical concepts.",
  };

  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);

  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  const [isSending, setIsSending] = useState(false);

  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getMentorHistory();

        if (response.messages.length > 0) {
          setMessages([
            welcomeMessage,

            ...response.messages.map((message, index) => ({
              id: message._id || `history-${index}`,

              role: message.role,

              content: message.content,
            })),
          ]);
        }
      } catch (error) {
        console.error("Load mentor history:", error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isSending]);

  const sendMessage = async (customMessage?: string) => {
    const message = (customMessage || input).trim();

    if (!message || isSending) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,

      role: "user",

      content: message,
    };

    setMessages((previous) => [...previous, userMessage]);

    setInput("");

    setError("");

    setIsSending(true);

    try {
      const response = await sendMentorMessage(message);

      const aiMessage: Message = {
        id: `assistant-${Date.now()}`,

        role: "assistant",

        content: response.message,
      };

      setMessages((previous) => [...previous, aiMessage]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get AI response";

      setError(message);

      setMessages((previous) => [
        ...previous,

        {
          id: `error-${Date.now()}`,

          role: "assistant",

          content: "I couldn't respond right now. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = async () => {
    try {
      setError("");

      await clearMentorHistory();

      setMessages([
        {
          id: `welcome-${Date.now()}`,

          role: "assistant",

          content: "Chat cleared. What would you like help with?",
        },
      ]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to clear chat");
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#080c14] text-white">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="min-h-screen lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="p-4 md:p-6 lg:p-8">
            {/* Header */}

            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-2 flex items-center gap-2 text-purple-400">
                  <Sparkles size={18} />

                  <span className="text-sm font-medium">
                    AI Powered Assistant
                  </span>
                </div>

                <h1 className="text-3xl font-bold">AI Career Mentor</h1>

                <p className="mt-2 text-sm text-gray-400">
                  Get help with interviews, coding, resumes and your career
                  preparation.
                </p>
              </div>

              <button
                onClick={clearChat}
                className="flex w-fit items-center gap-2 rounded-xl border border-gray-800 px-4 py-2.5 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
              >
                <Trash2 size={16} />
                Clear Chat
              </button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
              {/* Chat */}

              <div className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#101722]">
                {/* Chat Header */}

                <div className="flex items-center gap-3 border-b border-gray-800 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                    <Bot size={21} className="text-purple-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">SkillPrep AI</p>

                    <div className="mt-1 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-400" />

                      <span className="text-xs text-gray-500">AI Mentor</span>
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* Messages */}

                <div className="flex-1 space-y-6 overflow-y-auto p-4 md:p-6">
                  {isLoadingHistory && (
                    <div className="flex justify-center py-8">
                      <Loader2
                        size={22}
                        className="animate-spin text-purple-400"
                      />
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                          <Bot size={18} className="text-purple-400" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                          message.role === "user"
                            ? "bg-purple-600 text-white"
                            : "border border-gray-800 bg-[#0b111b] text-gray-300"
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.role === "user" && (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-800">
                          <User size={17} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isSending && (
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                        <Bot size={18} className="text-purple-400" />
                      </div>

                      <div className="rounded-2xl border border-gray-800 bg-[#0b111b] px-4 py-3">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />

                          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:150ms]" />

                          <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}

                <div className="border-t border-gray-800 p-4">
                  <div className="flex items-end gap-3 rounded-xl border border-gray-700 bg-[#0b111b] p-2 focus-within:border-purple-500">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !isSending) {
                          e.preventDefault();

                          sendMessage();
                        }
                      }}
                      placeholder="Ask your AI mentor..."
                      rows={1}
                      className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600"
                    />

                    <button
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || isSending}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isSending ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Send size={17} />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-center text-[11px] text-gray-600">
                    Press Enter to send • Shift + Enter for a new line
                  </p>
                </div>
              </div>

              {/* Right Panel */}

              <div>
                <div className="rounded-2xl border border-gray-800 bg-[#101722] p-5">
                  <div className="mb-5 flex items-center gap-2">
                    <Sparkles size={17} className="text-purple-400" />

                    <h2 className="font-semibold">Try asking</h2>
                  </div>

                  <div className="space-y-3">
                    {suggestions.map((suggestion) => {
                      const Icon = suggestion.icon;

                      return (
                        <button
                          key={suggestion.title}
                          onClick={() => sendMessage(suggestion.prompt)}
                          className="w-full rounded-xl border border-gray-800 bg-[#0b111b] p-4 text-left transition hover:border-purple-500/40 hover:bg-purple-500/5"
                        >
                          <div className="mb-3 flex items-center gap-2">
                            <Icon size={16} className="text-purple-400" />

                            <p className="text-sm font-medium">
                              {suggestion.title}
                            </p>
                          </div>

                          <p className="text-xs leading-5 text-gray-500">
                            {suggestion.prompt}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Capabilities */}

                <div className="mt-5 rounded-2xl border border-gray-800 bg-[#101722] p-5">
                  <h2 className="mb-4 font-semibold">I can help with</h2>

                  <div className="space-y-3 text-sm text-gray-400">
                    <p>✓ MERN interview preparation</p>
                    <p>✓ JavaScript & TypeScript</p>
                    <p>✓ React & Next.js</p>
                    <p>✓ Node.js & Express</p>
                    <p>✓ MongoDB</p>
                    <p>✓ AWS & deployment</p>
                    <p>✓ System design</p>
                    <p>✓ Resume improvement</p>
                    <p>✓ Career guidance</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

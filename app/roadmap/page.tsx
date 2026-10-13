"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Map,
  CheckCircle2,
  Circle,
  Lock,
  BookOpen,
  Code2,
  Database,
  Cloud,
  Server,
  Trophy,
  Clock3,
  Target,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Menu,
} from "lucide-react";

import AuthGuard from "../components/AuthGuard";

type RoadmapItem = {
  id: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  icon: any;
};

const roadmapData: RoadmapItem[] = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description:
      "Build strong JavaScript fundamentals required for modern web development.",
    duration: "1 Week",
    topics: [
      "Variables & Scope",
      "Functions",
      "Promises",
      "Async/Await",
      "Event Loop",
      "ES6+",
    ],
    icon: Code2,
  },
  {
    id: 2,
    title: "React.js",
    description:
      "Learn component-based frontend development and React optimization.",
    duration: "2 Weeks",
    topics: [
      "Components",
      "Props & State",
      "Hooks",
      "Context API",
      "React Router",
      "Performance Optimization",
    ],
    icon: Code2,
  },
  {
    id: 3,
    title: "Node.js & Express.js",
    description:
      "Build scalable REST APIs and understand backend architecture.",
    duration: "2 Weeks",
    topics: [
      "Node.js Architecture",
      "Event Loop",
      "Express",
      "Middleware",
      "REST API",
      "JWT Authentication",
    ],
    icon: Server,
  },
  {
    id: 4,
    title: "MongoDB",
    description:
      "Learn database design, aggregation, indexing and query optimization.",
    duration: "1 Week",
    topics: [
      "CRUD",
      "Schema Design",
      "Aggregation",
      "$lookup",
      "Indexes",
      "Query Optimization",
    ],
    icon: Database,
  },
  {
    id: 5,
    title: "Advanced Backend",
    description:
      "Learn the concepts needed to build production-ready applications.",
    duration: "2 Weeks",
    topics: [
      "Redis",
      "Caching",
      "Rate Limiting",
      "Queues",
      "Socket.IO",
      "Microservices Basics",
    ],
    icon: Server,
  },
  {
    id: 6,
    title: "AWS & Deployment",
    description:
      "Learn cloud deployment and common AWS services used by developers.",
    duration: "2 Weeks",
    topics: ["AWS EC2", "Lambda", "S3", "API Gateway", "Docker", "CI/CD"],
    icon: Cloud,
  },
  {
    id: 7,
    title: "System Design",
    description: "Understand how scalable applications are designed.",
    duration: "3 Weeks",
    topics: [
      "Load Balancing",
      "Caching",
      "Database Scaling",
      "Message Queues",
      "Horizontal Scaling",
      "High Availability",
    ],
    icon: Target,
  },
  {
    id: 8,
    title: "Interview Ready",
    description: "Complete final interview preparation and mock interviews.",
    duration: "1 Week",
    topics: [
      "MERN Revision",
      "Coding Questions",
      "System Design",
      "Mock Interviews",
      "Resume Review",
      "HR Questions",
    ],
    icon: Trophy,
  },
];

export default function CareerRoadmapPage() {
  const [completed, setCompleted] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number[]>([1]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleComplete = (id: number) => {
    setCompleted((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetProgress = () => {
    setCompleted([]);
  };

  const progress = Math.round((completed.length / roadmapData.length) * 100);

  return (
<AuthGuard>
<div className="min-h-screen bg-[#080c14] text-white">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64">
      <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8">
          {/* Header */}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                <Map size={18} />

                <span className="text-sm font-medium">
                  Personalized Learning Path
                </span>
              </div>

              <h1 className="text-3xl font-bold">Career Roadmap</h1>

              <p className="text-gray-400 mt-2">
                Follow this roadmap to become interview-ready for a Full Stack
                MERN Developer role.
              </p>
            </div>

            <button
              onClick={resetProgress}
              className="flex items-center gap-2 border border-gray-700 hover:bg-gray-800 px-4 py-2.5 rounded-lg text-sm w-fit"
            >
              <RotateCcw size={16} />
              Reset Progress
            </button>
          </div>

          {/* Stats */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatBox
              title="Roadmap Progress"
              value={`${progress}%`}
              icon={<Target size={20} />}
            />

            <StatBox
              title="Completed"
              value={`${completed.length}/${roadmapData.length}`}
              icon={<CheckCircle2 size={20} />}
            />

            <StatBox
              title="Estimated Time"
              value="14 Weeks"
              icon={<Clock3 size={20} />}
            />

            <StatBox
              title="Target Role"
              value="MERN Developer"
              icon={<Trophy size={20} />}
            />
          </div>

          {/* Progress */}

          <div className="bg-[#101722] border border-gray-800 rounded-2xl p-5 mb-8">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-400">Overall Progress</span>

              <span className="font-medium">{progress}%</span>
            </div>

            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* Roadmap */}

          <div className="max-w-4xl">
            {roadmapData.map((item, index) => {
              const Icon = item.icon;

              const isCompleted = completed.includes(item.id);

              const isExpanded = expanded.includes(item.id);

              const isLocked =
                index > 0 && !completed.includes(roadmapData[index - 1].id);

              return (
                <div key={item.id} className="relative pl-12 pb-8">
                  {/* Vertical line */}

                  {index !== roadmapData.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-gray-800" />
                  )}

                  {/* Step Circle */}

                  <div
                    className={`absolute left-0 top-2 w-10 h-10 rounded-full flex items-center justify-center border z-10 ${
                      isCompleted
                        ? "bg-green-500/20 border-green-500 text-green-400"
                        : isLocked
                        ? "bg-[#101722] border-gray-800 text-gray-600"
                        : "bg-purple-500/20 border-purple-500 text-purple-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={19} />
                    ) : isLocked ? (
                      <Lock size={17} />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>

                  {/* Card */}

                  <div
                    className={`bg-[#101722] border rounded-2xl overflow-hidden transition ${
                      isCompleted ? "border-green-500/30" : "border-gray-800"
                    }`}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-11 h-11 bg-[#0b111b] rounded-xl flex items-center justify-center shrink-0">
                            <Icon
                              size={20}
                              className={
                                isCompleted
                                  ? "text-green-400"
                                  : "text-purple-400"
                              }
                            />
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="font-semibold text-lg">
                                {item.title}
                              </h2>

                              {isCompleted && (
                                <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                                  Completed
                                </span>
                              )}

                              {isLocked && (
                                <span className="text-xs bg-gray-800 text-gray-500 px-2 py-1 rounded-full">
                                  Locked
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-400 mt-2 leading-6">
                              {item.description}
                            </p>

                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                              <Clock3 size={14} />
                              {item.duration}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="text-gray-500 hover:text-white"
                        >
                          {isExpanded ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                      </div>

                      {/* Topics */}

                      {isExpanded && (
                        <div className="mt-5 pt-5 border-t border-gray-800">
                          <div className="flex items-center gap-2 mb-4">
                            <BookOpen size={16} className="text-purple-400" />

                            <p className="text-sm font-medium">
                              Topics to Learn
                            </p>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3">
                            {item.topics.map((topic) => (
                              <div
                                key={topic}
                                className="flex items-center gap-2 bg-[#0b111b] border border-gray-800 rounded-lg p-3"
                              >
                                <Circle size={12} className="text-gray-500" />

                                <span className="text-sm text-gray-400">
                                  {topic}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-5">
                            <button
                              disabled={isLocked}
                              onClick={() => toggleComplete(item.id)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                                isLocked
                                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                  : isCompleted
                                  ? "border border-green-500/30 text-green-400 hover:bg-green-500/10"
                                  : "bg-purple-600 hover:bg-purple-700"
                              }`}
                            >
                              {isLocked ? (
                                <>
                                  <Lock size={16} />
                                  Complete Previous Step
                                </>
                              ) : isCompleted ? (
                                <>
                                  <CheckCircle2 size={16} />
                                  Mark as Incomplete
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 size={16} />
                                  Mark as Complete
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
</AuthGuard>
  );
}

function StatBox({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-[#101722] border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">{title}</p>

        <div className="text-purple-400">{icon}</div>
      </div>

      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

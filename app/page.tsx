import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileText,
  GraduationCap,
  Layers3,
  Menu,
  MessageSquareText,
  Play,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "AI Resume Builder",
    description:
      "Create a professional resume, improve your experience descriptions, and tailor your profile to your dream job.",
    icon: FileText,
    color: "text-violet-400",
    background: "bg-violet-500/10",
    tag: "Career ready",
  },
  {
    number: "02",
    title: "Technical Interview Prep",
    description:
      "Master JavaScript, React, Node.js, databases, system design, and the topics interviewers actually ask.",
    icon: BrainCircuit,
    color: "text-cyan-400",
    background: "bg-cyan-500/10",
    tag: "Learn by topic",
  },
  {
    number: "03",
    title: "AI Mock Interviews",
    description:
      "Practice answering questions, receive feedback, and identify areas you need to improve.",
    icon: MessageSquareText,
    color: "text-emerald-400",
    background: "bg-emerald-500/10",
    tag: "Practice smarter",
  },
  {
    number: "04",
    title: "Personalized Roadmaps",
    description:
      "Follow a structured learning path, set daily goals, and keep track of your progress.",
    icon: Target,
    color: "text-amber-400",
    background: "bg-amber-500/10",
    tag: "Stay consistent",
  },
];

const technologies = [
  { name: "JavaScript", short: "JS", color: "text-yellow-300" },
  { name: "React.js", short: "Re", color: "text-cyan-300" },
  { name: "Node.js", short: "N", color: "text-green-400" },
  { name: "MongoDB", short: "M", color: "text-emerald-400" },
  { name: "Next.js", short: "N", color: "text-white dark:text-white" },
  { name: "System Design", short: "SD", color: "text-violet-300" },
];

const benefits = [
  "Structured topic-wise questions",
  "Beginner to advanced difficulty",
  "Code examples and explanations",
  "Track your learning progress",
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-50 text-zinc-900 dark:bg-[#08090d] dark:text-zinc-100">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-52 left-1/2 h-[550px] w-[750px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute right-[-200px] top-[600px] h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[130px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#08090d]/85">
        <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/30">
              <Sparkles size={21} className="text-white" />
            </div>

            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              SkillPrep<span className="text-violet-500 dark:text-violet-400"> AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              Features
            </Link>
            <Link href="#interview-prep" className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              Interview Prep
            </Link>
            <Link href="#how-it-works" className="text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
              How it works
            </Link>
          </div>

          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/login" className="text-sm font-medium text-zinc-700 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white">
              Log in
            </Link>

            <Link href="/register" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-500">
              Get started <ArrowUpRight size={16} />
            </Link>
          </div>

          <button type="button" aria-label="Mobile navigation menu" className="rounded-lg border border-zinc-200 p-2 text-zinc-600 dark:border-white/10 dark:text-zinc-300 sm:hidden">
            <Menu size={22} />
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-3.5 py-2 text-xs font-medium text-violet-600 dark:text-violet-300 sm:text-sm">
              <Sparkles size={15} />
              Your next career move starts here
              <ArrowRight size={14} />
            </div>

            <h1 className="max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-zinc-900 sm:text-5xl dark:text-white lg:text-7xl">
              Your skills.
              <br />
              Your future.
              <br />
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
                Your next job.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg">
              Build a resume that stands out, master technical interviews, and
              practice with AI. Everything you need to prepare for your next
              career opportunity, in one place.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/resume-builder" className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-violet-950/20 transition hover:-translate-y-0.5 hover:bg-violet-500 dark:shadow-violet-950/40">
                Build my resume <ArrowRight size={18} />
              </Link>

              <Link href="/interview-prep" className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:border-white/20 dark:hover:bg-white/[0.06]">
                <Play size={17} /> Explore interview prep
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
                Resume builder
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
                Topic-wise learning
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
                Mock interviews
              </span>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-8 rounded-[40px] bg-violet-600/10 blur-3xl" />

            <div className="relative rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl shadow-zinc-300/40 dark:border-white/10 dark:bg-[#101117] dark:shadow-black/50 sm:p-6">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-5 dark:border-white/[0.08]">
                <div>
                  <p className="text-xs text-zinc-500">YOUR WORKSPACE</p>
                  <h2 className="mt-1 text-lg font-semibold text-zinc-900 dark:text-white">
                    Career Dashboard
                  </h2>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10">
                  <GraduationCap size={20} className="text-violet-600 dark:text-violet-300" />
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
                  <div className="flex items-center justify-between">
                    <FileText size={18} className="text-violet-500 dark:text-violet-400" />
                    <ArrowUpRight size={15} className="text-zinc-400 dark:text-zinc-600" />
                  </div>
                  <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">Resume</p>
                  <p className="mt-1 text-xs text-zinc-500">Create your profile</p>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/[0.07] dark:bg-white/[0.025]">
                  <div className="flex items-center justify-between">
                    <BrainCircuit size={18} className="text-cyan-500 dark:text-cyan-400" />
                    <ArrowUpRight size={15} className="text-zinc-400 dark:text-zinc-600" />
                  </div>
                  <p className="mt-4 text-2xl font-bold text-zinc-900 dark:text-white">Practice</p>
                  <p className="mt-1 text-xs text-zinc-500">Improve your skills</p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5 dark:border-white/[0.07] dark:bg-white/[0.02]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">Your learning path</p>
                    <p className="mt-1 text-xs text-zinc-500">Topics to explore</p>
                  </div>
                  <span className="rounded-lg bg-violet-500/10 px-2.5 py-1 text-xs text-violet-600 dark:text-violet-300">
                    Start learning
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  {[
                    { name: "JavaScript", progress: "Core concepts" },
                    { name: "React.js", progress: "Components & hooks" },
                    { name: "Node.js", progress: "Backend development" },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                        <Code2 size={17} className="text-violet-600 dark:text-violet-300" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{item.name}</p>
                        <p className="mt-0.5 text-xs text-zinc-500">{item.progress}</p>
                      </div>

                      <ChevronRight size={17} className="text-zinc-400 dark:text-zinc-600" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-50 p-4 dark:border-emerald-400/10 dark:bg-emerald-400/[0.04]">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-400/10">
                  <Zap size={18} className="text-emerald-500 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">One step at a time</p>
                  <p className="mt-1 text-xs text-zinc-500">Build skills. Practice. Get interview ready.</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-5 top-24 hidden items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#171820] sm:flex">
              <div className="rounded-lg bg-violet-500/10 p-2">
                <Sparkles size={19} className="text-violet-600 dark:text-violet-300" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-white">AI-powered tools</p>
                <p className="mt-1 text-[10px] text-zinc-500">Built for your career</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology strip */}
      <section id="interview-prep" className="relative z-10 border-y border-zinc-200 bg-zinc-100/70 px-5 py-12 dark:border-white/[0.07] dark:bg-white/[0.015] sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Prepare for the technologies that matter
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {technologies.map((tech) => (
              <div key={tech.name} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition hover:border-violet-300 hover:bg-violet-50 dark:border-white/[0.07] dark:bg-white/[0.02] dark:hover:border-violet-400/30 dark:hover:bg-white/[0.04]">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-bold dark:bg-white/[0.05] ${tech.color}`}>
                  {tech.short}
                </div>
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 sm:text-sm">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
              EVERYTHING YOU NEED
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              Your career toolkit,
              <br />
              <span className="text-zinc-500">all in one place.</span>
            </h2>

            <p className="mt-5 leading-7 text-zinc-600 dark:text-zinc-400">
              Stop switching between different tools. Build your resume,
              strengthen your technical knowledge, and practice with a clear
              plan.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div key={feature.number} className="group rounded-2xl border border-zinc-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:bg-violet-50 dark:border-white/[0.08] dark:bg-[#101117] dark:hover:border-violet-400/30 dark:hover:bg-[#13141c]">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.background}`}>
                      <Icon size={23} className={feature.color} />
                    </div>

                    <span className="text-sm font-medium text-zinc-400 dark:text-zinc-700">
                      {feature.number}
                    </span>
                  </div>

                  <span className="mt-6 inline-block rounded-md border border-zinc-200 px-2.5 py-1 text-[10px] font-medium text-zinc-600 dark:border-white/[0.07] dark:text-zinc-400">
                    {feature.tag}
                  </span>

                  <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">{feature.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-zinc-700 transition group-hover:text-violet-600 dark:text-zinc-300 dark:group-hover:text-violet-300">
                    Explore feature
                    <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interview preparation section */}
      <section className="relative z-10 px-5 pb-20 sm:px-8 sm:pb-28 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-12 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-gradient-to-br dark:from-[#15121f] dark:via-[#101117] dark:to-[#0c1018] sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10">
              <Code2 size={24} className="text-violet-600 dark:text-violet-300" />
            </div>

            <h2 className="mt-6 text-3xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-4xl">
              Turn interview anxiety into
              <span className="text-violet-500 dark:text-violet-400"> confidence.</span>
            </h2>

            <p className="mt-5 leading-7 text-zinc-600 dark:text-zinc-400">
              Learn concepts in simple language, understand code examples, and
              practice the questions that matter for your target role.
            </p>

            <div className="mt-7 space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-500 dark:text-emerald-400" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{benefit}</span>
                </div>
              ))}
            </div>

            <Link href="/interview-prep" className="mt-9 inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
              Explore interview topics <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/[0.08] dark:bg-[#090a0f] sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-5 dark:border-white/[0.08]">
              <div>
                <p className="text-xs text-zinc-500">QUESTION PREVIEW</p>
                <h3 className="mt-2 font-semibold text-zinc-900 dark:text-white">JavaScript Fundamentals</h3>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-50 px-3 py-1 text-xs text-emerald-600 dark:bg-emerald-400/[0.07] dark:text-emerald-300">
                Beginner
              </span>
            </div>

            <p className="mt-6 text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200">
              What is the difference between `var`, `let`, and `const` in
              JavaScript?
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Scope and accessibility",
                "Hoisting and initialization",
                "Reassignment and redeclaration",
              ].map((topic, index) => (
                <div key={topic} className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-white/[0.06] dark:bg-white/[0.02]">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-500/10 text-xs font-semibold text-violet-600 dark:text-violet-300">
                    0{index + 1}
                  </span>
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{topic}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-400/15 dark:bg-violet-400/[0.05]">
              <div className="flex items-center gap-2 text-sm font-medium text-violet-600 dark:text-violet-300">
                <Sparkles size={16} />
                Learn with explanations
              </div>
              <p className="mt-2 text-xs leading-6 text-zinc-600 dark:text-zinc-400">
                Understand the concept first, then practice with examples and
                follow-up interview questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 border-y border-zinc-200 bg-zinc-100/70 px-5 py-20 dark:border-white/[0.07] dark:bg-white/[0.015] sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">
              YOUR JOURNEY
            </span>
            <h2 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-white sm:text-4xl">
              Three steps to get started
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Build your profile",
                description:
                  "Create your resume with your skills, experience, projects, and career goals.",
                icon: BriefcaseBusiness,
              },
              {
                step: "02",
                title: "Learn and practice",
                description:
                  "Choose your technology, study concepts, and test your knowledge with quizzes.",
                icon: Layers3,
              },
              {
                step: "03",
                title: "Prepare for interviews",
                description:
                  "Practice mock interviews, review feedback, and work on areas for improvement.",
                icon: Trophy,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.step} className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#101117] sm:p-8">
                  <div className="flex items-center justify-between">
                    <Icon size={25} className="text-violet-500 dark:text-violet-400" />
                    <span className="text-sm text-zinc-400 dark:text-zinc-600">{item.step}</span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold text-zinc-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-5 py-20 sm:px-8 sm:py-28 lg:px-10">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-100 via-white to-indigo-50 px-6 py-14 text-center dark:border-violet-400/20 dark:bg-gradient-to-br dark:from-violet-950/70 dark:via-[#171128] dark:to-[#101117] sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-300/30 bg-violet-400/10">
              <Sparkles size={26} className="text-violet-600 dark:text-violet-300" />
            </div>

            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold leading-tight text-zinc-900 dark:text-white sm:text-5xl">
              Your next opportunity starts with preparation.
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-zinc-600 dark:text-zinc-400">
              Create your resume, strengthen your skills, and take the next
              step in your career with SkillPrep AI.
            </p>

            <Link href="/register" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold text-white transition hover:bg-violet-500">
              Start your journey <ArrowRight size={18} />
            </Link>

            <p className="mt-4 text-xs text-zinc-500">
              Start building your career toolkit today.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 px-5 py-8 dark:border-white/[0.08] sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
              <Sparkles size={17} className="text-white" />
            </div>
            <span className="font-semibold text-zinc-900 dark:text-white">
              SkillPrep<span className="text-violet-500 dark:text-violet-400"> AI</span>
            </span>
          </Link>

          <p className="text-center text-xs text-zinc-500">
            Build skills. Practice with purpose. Grow your career.
          </p>

          <Link href="#" className="flex items-center gap-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white">
            Back to top <ArrowDownRight size={15} />
          </Link>
        </div>
      </footer>
    </main>
  );
}
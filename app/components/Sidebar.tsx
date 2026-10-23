"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  BrainCircuit,
  MessageSquare,
  Map,
  Sparkles,
  ChevronLeft,
  X,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resume Builder",
    href: "/resume-builder",
    icon: FileText,
  },
  {
    label: "My Resumes",
    href: "/resumes",
    icon: FileText,
  },
  {
    label: "Interview Prep",
    href: "/interview-preparation",
    icon: BrainCircuit,
  },
  {
    label: "Mock Interviews",
    href: "/mock-interview",
    icon: MessageSquare,
  },
  {
    label: "Learning Roadmap",
    href: "/roadmap",
    icon: Map,
  },
  {
    label: "Skill Assessment",
    href: "/skill-assessment",
    icon: BrainCircuit,
  },
  {
    label: "AI Career Mentor",
    href: "/ai-mentor",
    icon: MessageSquare,
  },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="
            fixed inset-0 z-40
            bg-black/40
            dark:bg-black/60
            lg:hidden
          "
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col
          border-r
          border-zinc-200
          bg-white
          text-zinc-900
          transition-transform duration-300
          dark:border-white/[0.08]
          dark:bg-[#0d0e13]
          dark:text-white
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo Header */}
        <div
          className="
            flex h-[76px]
            items-center justify-between
            border-b
            border-zinc-200
            px-5
            dark:border-white/[0.08]
          "
        >
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-gradient-to-br
                from-violet-500
                to-indigo-600
              "
            >
              <Sparkles size={20} className="text-white" />
            </div>

            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              SkillPrep{" "}
              <span className="text-violet-600 dark:text-violet-400">AI</span>
            </span>
          </Link>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="
              text-zinc-500
              transition
              hover:text-zinc-900
              dark:text-zinc-400
              dark:hover:text-white
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 pt-7">
          <p
            className="
              mb-3 px-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-zinc-500
            "
          >
            Workspace
          </p>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3
                    rounded-xl
                    border
                    px-3 py-3
                    text-sm
                    font-medium
                    transition

                    ${
                      active
                        ? `
                          border-violet-400/20
                          bg-violet-50
                          text-violet-700
                          dark:border-violet-400/10
                          dark:bg-violet-500/10
                          dark:text-violet-300
                        `
                        : `
                          border-transparent
                          text-zinc-600
                          hover:bg-zinc-100
                          hover:text-zinc-900
                          dark:text-zinc-400
                          dark:hover:bg-white/[0.04]
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  <Icon size={19} />

                  {item.label}

                  {active && (
                    <ChevronLeft size={15} className="ml-auto rotate-180" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Career Card */}
        <div className="mt-auto p-4">
          <div
            className="
              rounded-2xl
              border
              border-violet-200
              bg-gradient-to-br
              from-violet-50
              to-indigo-50
              p-4

              dark:border-violet-400/15
              dark:from-violet-500/10
              dark:to-indigo-500/5
            "
          >
            {/* Icon */}
            <div
              className="
                flex h-9 w-9
                items-center justify-center
                rounded-xl
                bg-violet-100
                dark:bg-violet-500/15
              "
            >
              <Sparkles
                size={18}
                className="text-violet-600 dark:text-violet-300"
              />
            </div>

            {/* Title */}
            <h3
              className="
                mt-3
                text-sm
                font-semibold
                text-zinc-900
                dark:text-white
              "
            >
              Career growth
            </h3>

            {/* Description */}
            <p
              className="
                mt-2
                text-xs
                leading-5
                text-zinc-600
                dark:text-zinc-400
              "
            >
              Build your skills and get ready for your next opportunity.
            </p>

            {/* Roadmap Button */}
            <Link
              href="/roadmap"
              onClick={onClose}
              className="
                mt-4
                flex
                items-center
                justify-center
                rounded-lg
                bg-violet-600
                px-3
                py-2
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-violet-500
              "
            >
              View roadmap
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const topics = [
  { name: "JavaScript", detail: "Core concepts", progress: 75 },
  { name: "React.js", detail: "Hooks and rendering", progress: 55 },
  { name: "Node.js", detail: "Backend fundamentals", progress: 40 },
  { name: "MongoDB", detail: "Queries and aggregation", progress: 25 },
];

export default function ProgressCard() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Interview preparation
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Continue building your skills
          </p>
        </div>

        <Link
          href="/interview-prep"
          className="flex items-center gap-1 text-xs font-medium text-violet-300 hover:text-violet-200 sm:text-sm"
        >
          View all <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-6 space-y-6">
        {topics.map((topic) => (
          <div key={topic.name}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-zinc-200">
                  {topic.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{topic.detail}</p>
              </div>

              <span className="text-sm font-semibold text-zinc-300">
                {topic.progress}%
              </span>
            </div>

            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]"
              role="progressbar"
              aria-label={`${topic.name} progress`}
              aria-valuenow={topic.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all"
                style={{ width: `${topic.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-start gap-3 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
        <CheckCircle2
          size={18}
          className="mt-0.5 shrink-0 text-emerald-400"
        />
        <div>
          <p className="text-sm font-medium text-zinc-200">
            Consistency is key
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Practice a little every day to strengthen your interview skills.
          </p>
        </div>
      </div>
    </section>
  );
}
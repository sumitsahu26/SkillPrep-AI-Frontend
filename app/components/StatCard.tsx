import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: string;
  background: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  background,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 dark:border-white/[0.08] dark:bg-[#101117] dark:hover:border-white/[0.15]">
      <div className="flex items-start justify-between">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${background}`}>
          <Icon size={21} className={color} />
        </div>

        <ArrowUpRight size={17} className="text-zinc-400 dark:text-zinc-600" />
      </div>

      <p className="mt-5 text-sm text-zinc-600 dark:text-zinc-400">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
        {value}
      </p>
      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </div>
  );
}
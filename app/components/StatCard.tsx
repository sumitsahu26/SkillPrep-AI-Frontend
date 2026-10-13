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
    <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5 transition hover:border-white/[0.15]">
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${background}`}
        >
          <Icon size={21} className={color} />
        </div>

        <ArrowUpRight size={17} className="text-zinc-600" />
      </div>

      <p className="mt-5 text-sm text-zinc-400">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-xs text-zinc-500">{description}</p>
    </div>
  );
}
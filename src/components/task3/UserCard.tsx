"use client";

import Link from "next/link";
import { User } from "@/types";

interface UserCardProps {
  user: User;
  index: number;
}

const AVATAR_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-600",
  "from-fuchsia-500 to-violet-600",
  "from-sky-500 to-cyan-600",
  "from-lime-500 to-green-600",
  "from-red-500 to-rose-600",
];

export default function UserCard({ user, index }: UserCardProps) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 rounded-2xl p-5 sm:p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">

      {/* Top */}
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm sm:text-base font-bold shadow-md`}
        >
          {initials}
        </div>

        <div className="min-w-0">
          <p className="text-white font-semibold text-sm sm:text-base truncate">
            {user.name}
          </p>
          <p className="text-slate-400 text-xs sm:text-sm truncate">
            {user.company.name}
          </p>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center gap-2 text-slate-300 text-sm">
        <span className="text-slate-500">✉</span>
        <p className="truncate">{user.email}</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/5" />

      {/* Button */}
      <Link
        href={`/task3/users/${user.id}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/20 hover:border-blue-400/50 text-blue-300 hover:text-white text-sm font-semibold transition-all duration-200"
      >
        View Posts
        <span className="group-hover:translate-x-0.5 transition">→</span>
      </Link>
    </div>
  );
}
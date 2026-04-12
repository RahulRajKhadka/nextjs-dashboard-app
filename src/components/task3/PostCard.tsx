import { Post } from "@/types";

interface PostCardProps {
  post: Post;
  isLocal?: boolean;
}

export default function PostCard({ post, isLocal = false }: PostCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 border transition-all duration-200 flex flex-col gap-4 ${
        isLocal
          ? "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-400/40"
          : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <h3 className="text-white text-base sm:text-lg font-semibold leading-snug flex-1">
          {post.title}
        </h3>

        {isLocal && (
          <span className="px-2.5 py-1 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full whitespace-nowrap">
            Local
          </span>
        )}
      </div>

      {/* Body */}
      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
        {post.body}
      </p>
    </div>
  );
}
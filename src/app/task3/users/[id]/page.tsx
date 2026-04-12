"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/useStore";
import PostCard from "@/components/task3/PostCard";
import PostForm from "@/components/task3/PostForm";
import Pagination from "@/components/task3/pagination";
import { Post } from "@/types";

const POSTS_PER_PAGE = 5;

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

export default function UserPostsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);

  const {
    users,
    posts,
    postsLoading,
    postsError,
    setPosts,
    setPostsLoading,
    setPostsError,
    localPosts,
    loadLocalPosts,
  } = useDashboardStore();

  const [currentPage, setCurrentPage] = useState(1);

  const user = users.find((u) => u.id === userId);
  const gradient = AVATAR_GRADIENTS[(userId - 1) % AVATAR_GRADIENTS.length];

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : `U${userId}`;

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setPostsLoading(true);
      setPostsError(null);
      try {
        const res = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch posts");

        const data: Post[] = await res.json();
        setPosts(data);
      } catch (err) {
        setPostsError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
    loadLocalPosts(userId);
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [localPosts.length]);

  const allPosts = [...localPosts, ...posts];
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
      
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col gap-6 sm:gap-8">

        {/* Back */}
        <button
          onClick={() => router.push("/task3")}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition group"
        >
          <span className="group-hover:-translate-x-0.5 transition">←</span>
          Back to Users
        </button>

        {/* User Card */}
        <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 sm:p-6 flex items-center gap-3 sm:gap-5">

          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold shadow-lg`}
          >
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white truncate">
              {user?.name ?? `User #${userId}`}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 truncate">
              {user?.email}
            </p>

            {user?.company.name && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 rounded-full">
                {user.company.name}
              </span>
            )}
          </div>

          <div className="text-right">
            <p className="text-xl sm:text-2xl font-bold text-white">
              {allPosts.length}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500">posts</p>
          </div>
        </div>

        {/* Form */}
        <PostForm userId={userId} />

        {/* Posts Section */}
        <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 sm:p-6 flex flex-col gap-4">

          <h2 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
            <span className="w-1.5 h-4 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full" />
            Posts

            {allPosts.length > 0 && (
              <span className="ml-auto text-[10px] sm:text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
            )}
          </h2>

          {/* Loading */}
          {postsLoading && (
            <div className="flex flex-col items-center py-16 gap-4">
              <div className="w-8 h-8 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Loading posts...</p>
            </div>
          )}

          {/* Error */}
          {postsError && (
            <div className="text-center py-12">
              <p className="text-red-400 text-sm">Something went wrong</p>
              <p className="text-slate-500 text-xs">{postsError}</p>
            </div>
          )}

          {/* Empty */}
          {!postsLoading && !postsError && allPosts.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-12">
              No posts found.
            </p>
          )}

          {/* Posts */}
          {!postsLoading && !postsError && paginatedPosts.length > 0 && (
            <div className="flex flex-col gap-3 sm:gap-4">
              {paginatedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isLocal={localPosts.some((lp) => lp.id === post.id)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="pt-4 sm:pt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
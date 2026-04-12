"use client";

import { useEffect, useMemo } from "react";
import { useDashboardStore } from "@/store/useStore";
import UserCard from "@/components/task3/UserCard";
import SearchBar from "@/components/task3/SearchBar";
import { User } from "@/types";

interface UsersClientProps {
  initialUsers: User[];
  initialError: string | null;
}

export default function UsersClient({ initialUsers, initialError }: UsersClientProps) {
  const { setUsers, setError, searchQuery, setSearchQuery } = useDashboardStore();

  useEffect(() => {
    if (initialError) {
      setError(initialError);
    } else {
      setUsers(initialUsers);
    }
  }, [initialUsers, initialError, setUsers, setError]);

  const users = useDashboardStore((s) => s.users);
  const error = useDashboardStore((s) => s.error);
  const apiIsLoading = useDashboardStore((s) => s.apiIsLoading);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  if (apiIsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
        <p className="text-slate-400 text-sm tracking-wide">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center text-red-400 text-xl">
          ✕
        </div>
        <p className="text-red-400 text-sm">Something went wrong</p>
        <p className="text-slate-500 text-xs">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Stats + Search row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <p className="text-slate-300 text-sm">
            <span className="text-white font-semibold">{filteredUsers.length}</span>
            {" "}of{" "}
            <span className="text-white font-semibold">{users.length}</span>
            {" "}users
          </p>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      {/* No results */}
      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p className="text-slate-400 text-sm">No users match your search.</p>
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs text-blue-400 hover:text-blue-300 underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* User grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user, i) => (
          <UserCard key={user.id} user={user} index={i} />
        ))}
      </div>
    </div>
  );
}
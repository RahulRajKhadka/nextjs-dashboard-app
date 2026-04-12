import UsersClient from "@/components/task3/UserClient";
import { User } from "@/types";

async function getUsers(): Promise<User[]> {
  const res = await fetch("https://jsonplaceholder.typicode.com/users", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  return res.json();
}

export default async function Task3Page() {
  let users: User[] = [];
  let fetchError: string | null = null;

  try {
    users = await getUsers();
  } catch {
    fetchError = "Something went wrong while fetching users.";
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex flex-col items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-10">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-blue-300 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            Task 3
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            User &amp; Posts
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              {" "}Dashboard
            </span>
          </h1>

          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Browse users, search instantly, and manage posts
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8">
          <UsersClient initialUsers={users} initialError={fetchError} />
        </div>
      </div>
    </main>
  );
}
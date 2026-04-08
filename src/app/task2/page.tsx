import CourseCards from "@/components/task2/CourseCards";
import Link from "next/link";

export default function Task2Page() {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Back to Home
        </Link>
        <span className="text-sm font-semibold text-gray-700">
          Task 2 — Courses Dashboard
        </span>
      </div>

      <CourseCards />
    </main>
  );
}
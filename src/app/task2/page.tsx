"use client"
import dynamic from "next/dynamic";
import Link from "next/link";

const CourseCards = dynamic(() => import("@/components/task2/CourseCards"), {
  loading: () => (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      Loading courses...
    </div>
  ),
  ssr: false,
});

export default function Task2Page() {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Back to Home
        </Link>
        <span className="text-sm font-semibold text-gray-700">Task 2 — Courses Dashboard</span>
      </div>
      <CourseCards />
    </main>
  );
}
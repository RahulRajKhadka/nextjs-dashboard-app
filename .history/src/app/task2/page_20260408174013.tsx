"use client";
import dynamic from "next/dynamic";
import Link from "next/link";

const CourseCards = dynamic(() => import("@/components/task2/CourseCards"), {
  loading: () => (
    <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
      Loading courses...
    </div>
  ),
  ssr: false,
});

export default function Task2Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-gray-200 bg-white">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← Back
        </Link>

        <span className="text-sm font-semibold text-gray-700">
          Courses Dashboard
        </span>
      </div>

      {/* Centered Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        
        <div className="w-full max-w-6xl">
          
          {/* Heading */}
          <div className="mb-8 text-center mt-10">
            <h1 className="text-3xl font-bold text-gray-800">
              Explore Courses
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Choose a category to view available learning paths
            </p>
          </div>

          {/* Cards */}
          <div className="bg-white rounded-3xl shadow-sm p-4 md:p-6">
            <CourseCards />
          </div>

        </div>

      </div>
    </main>
  );
}
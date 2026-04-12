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
    <main className="min-h-screen bg-gray-50 flex flex-col gap-6 "> // main container
      
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
        
        <div className="w-full max-w-7xl">
          
          {/* Heading */}
          <div className="mb-8 text-center mt-10">
          <p className="text-[#414141] text-sm mb-1">Your SkillShikshya Journey</p>
      <h2
        className="text-3xl font-bold"
        style={{ marginTop: "24px", marginBottom: "48px " }}
      >
        <span className="text-[#2E9E6B]"></span>{" "}
        <span className="text-gray-800">Dive Into</span>{" "}
        <span className="text-[#2E9E6B]">What's Hot Right Now 🔥</span>{" "}
        
      </h2>

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
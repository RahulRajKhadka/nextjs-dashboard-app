
"use client"
import dynamic from "next/dynamic";
import Link from "next/link";

const JourneyCards = dynamic(() => import("@/components/task1/JourneyCards"), {
  loading: () => (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      Loading journey...
    </div>
  ),
  ssr: false,
});

export default function Task1Page() {
  return (
    <main className="min-h-screen bg-white">
        
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          ← Back to Home
        </Link>
        <span className="text-sm font-semibold text-gray-700">Task 1 — UI Design</span>
      </div>
      <JourneyCards />
    </main>
  );
}
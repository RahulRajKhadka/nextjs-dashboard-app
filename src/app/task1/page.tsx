import JourneyCards from "@/components/task1/JourneyCards";
import Link from "next/link";

export default function Task1Page() {
  return (
    <main className="min-h-screen bg-white">
      {/* Top nav */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Back to Home
        </Link>
        <span className="text-sm font-semibold text-gray-700">Task 1 — UI Design</span>
      </div>

      <JourneyCards />
    </main>
  );
}
"use client";
import { useState } from "react";

const courses = [
  {
    id: 1,
    count: "23",
    label: "All Courses",
    sublabel: "courses you're powering through right now.",
    bg: "#D94F3D",
    icons: ["⚛️", "💬", "🟩", "🪁"],
  },
  {
    id: 2,
    count: "05",
    label: "Upcoming Courses",
    sublabel: "exciting new courses waiting to boost your skills.",
    bg: "#FAE8E6",
    textColor: "#D94F3D",
  },
  {
    id: 3,
    count: "10",
    label: "Ongoing Courses",
    sublabel: "currently happening—don't miss out on the action!",
    bg: "#FAE8E6",
    textColor: "#D94F3D",
  },
];

export default function CourseCards() {
  const [activeId, setActiveId] = useState(1);

  return (
    <section className="px-6 py-10 max-w-5xl mx-auto">
      <p className="text-gray-500 text-sm mb-1">
        Explore our classes and master trending skills!
      </p>
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Dive Into{" "}
        <span className="text-[#2E9E6B]">What&apos;s Hot Right Now!</span> 🔥
      </h2>

      <div className="flex gap-4 items-stretch h-72">
        {courses.map((course) => {
          const isActive = course.id === activeId;
          const isLight = course.id !== 1;
          const textColor = isLight ? course.textColor || "#D94F3D" : "white";

          return (
            <div
              key={course.id}
              onClick={() => setActiveId(course.id)}
              className="rounded-3xl overflow-hidden cursor-pointer relative flex flex-col justify-between p-6"
              style={{
                backgroundColor: course.bg,
                // Animate width: big = 55%, small = 22.5%
                flex: isActive ? "0 0 55%" : "0 0 22.5%",
                transition: "flex 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                minWidth: 0,
              }}
            >
              {/* TOP: icons row (only for card 1 when active) */}
              {course.id === 1 && isActive && (
                <div className="flex gap-2 mb-2">
                  {course.icons?.map((icon, i) => (
                    <span key={i} className="text-xl">
                      {icon}
                    </span>
                  ))}
                </div>
              )}

              {/* TOP: vertical label when SMALL */}
              {!isActive && (
                <div className="flex-1 flex items-start overflow-hidden">
                  <p
                    className="font-bold text-base whitespace-nowrap"
                    style={{
                      color: textColor,
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {course.label}
                  </p>
                  <p
                    className="text-xs ml-2 leading-snug"
                    style={{
                      color: textColor,
                      opacity: 0.7,
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)",
                    }}
                  >
                    {course.sublabel}
                  </p>
                </div>
              )}

              {/* ACTIVE expanded content */}
              {isActive && (
                <div className="flex-1 flex flex-col justify-between">
                  {/* View all link — only card 1 */}
                  {course.id === 1 && (
                    <div className="flex justify-end">
                      <span
                        className="text-sm opacity-80"
                        style={{ color: textColor }}
                      >
                        View all Courses →
                      </span>
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-end gap-1">
                      <span
                        className="font-bold leading-none"
                        style={{
                          fontSize: "5rem",
                          color: textColor,
                        }}
                      >
                        {course.count}
                      </span>
                      <span
                        className="font-bold text-4xl mb-3"
                        style={{ color: textColor }}
                      >
                        +
                      </span>
                    </div>
                    <p
                      className="font-semibold text-lg"
                      style={{ color: textColor }}
                    >
                      {course.label}
                    </p>
                    <p
                      className="text-sm mt-1 opacity-70"
                      style={{ color: textColor }}
                    >
                      {course.sublabel}
                    </p>
                  </div>
                </div>
              )}

              {/* SMALL: count at bottom */}
              {!isActive && (
                <div className="flex items-end gap-1 mt-2">
                  <span
                    className="font-bold leading-none"
                    style={{ fontSize: "3.5rem", color: textColor }}
                  >
                    {course.count}
                  </span>
                  <span
                    className="font-bold text-2xl mb-2"
                    style={{ color: textColor }}
                  >
                    +
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
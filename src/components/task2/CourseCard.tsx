// src/components/task2/CourseCard.tsx
"use client";
import { forwardRef } from "react";
import { CourseCard as CourseCardType } from "@/types";

interface CourseCardProps {
  course: CourseCardType;
  isActive: boolean;
  onClick: () => void;
  overlayRef?: React.RefObject<HTMLDivElement>; 
}

export const CourseCard = forwardRef<HTMLDivElement, CourseCardProps>(
  ({ course, isActive, onClick, overlayRef }, ref) => {
    const bgClass = "bg-gray-100"; // always gray base background
    const textClass = isActive ? "text-white" : "text-gray-800";
    const mutedClass = isActive ? "text-white/70" : "text-gray-500";
    const basisClass = isActive ? "basis-[55%]" : "basis-[22.5%]";

    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`relative rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between p-6 transition-all duration-300 ${bgClass} ${textClass} ${basisClass} shrink-0 grow-0 min-w-0`}
      >
        {/* RED OVERLAY – animated via clip-path */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[#D94F3D] z-0 pointer-events-none"
          style={{ clipPath: "circle(0% at 100% 0%)" }}
        />

        {/* All content sits on top of the overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full">
        
          {course.id === 1 && isActive && course.icons && (
            <div className="flex gap-2">
              {course.icons.map((icon, i) => (
                <span key={i} className="text-xl">{icon}</span>
              ))}
            </div>
          )}

          {/* Vertical label – small cards */}
          {!isActive && (
            <div className="flex-1 flex flex-row items-start gap-1 overflow-hidden">
              <p className="font-bold text-base whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                {course.label}
              </p>
              <p className={`text-xs whitespace-nowrap ${mutedClass} [writing-mode:vertical-rl] rotate-180`}>
                {course.sublabel}
              </p>
            </div>
          )}

          {/* Active card content */}
          {isActive && (
            <div className="flex flex-col justify-end flex-1 mt-2">
              {course.id === 1 && (
                <div className="flex justify-end mb-2">
                  <span className={`text-sm ${mutedClass}`}>View all Courses →</span>
                </div>
              )}
              <div className="mt-auto">
                <div className="flex items-end gap-1">
                  <span className="font-bold leading-none text-8xl">{course.count}</span>
                  <span className={`font-bold text-4xl mb-3 ${mutedClass}`}>+</span>
                </div>
                <p className="font-semibold text-lg">{course.label}</p>
                <p className={`text-sm mt-1 ${mutedClass}`}>{course.sublabel}</p>
              </div>
            </div>
          )}

          {/* Count for small cards */}
          {!isActive && (
            <div className="flex items-end gap-1">
              <span className="font-bold leading-none text-5xl">{course.count}</span>
              <span className={`font-bold text-xl mb-1 ${mutedClass}`}>+</span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

CourseCard.displayName = "CourseCard";
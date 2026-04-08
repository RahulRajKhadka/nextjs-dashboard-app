// src/components/task2/CourseCard.tsx
"use client";
import { forwardRef } from "react";
import { CourseCard as CourseCardType } from "@/types";

interface CourseCardProps {
  course: CourseCardType;
  isActive: boolean;
  onClick: () => void;  
}

export const CourseCard = forwardRef<HTMLDivElement, CourseCardProps>(
  ({ course, isActive, onClick }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}  
        className="rounded-3xl overflow-hidden cursor-pointer relative flex flex-col justify-between p-6"
        style={{
          backgroundColor: course.bg,
          flexBasis: isActive ? "55%" : "22.5%",
          flexShrink: 0,
          flexGrow: 0,
          minWidth: 0,
        }}
      >
        {/* Icons row — active card 1 only */}
        {course.id === 1 && isActive && course.icons && (
          <div className="flex gap-2">
            {course.icons.map((icon, i) => (
              <span key={i} className="text-xl">{icon}</span>
            ))}
          </div>
        )}

        {/* Vertical label — small cards */}
        {!isActive && (
          <div className="flex-1 flex flex-row items-start gap-1 overflow-hidden">
            <p
              className="font-bold text-base whitespace-nowrap"
              style={{
                color: course.textColor,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {course.label}
            </p>
            <p
              className="text-xs whitespace-nowrap"
              style={{
                color: course.textColor,
                opacity: 0.65,
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              {course.sublabel}
            </p>
          </div>
        )}

      
        {isActive && (
          <div className="flex flex-col justify-end flex-1 mt-2">
            {course.id === 1 && (
              <div className="flex justify-end mb-2">
                <span className="text-sm opacity-75" style={{ color: course.textColor }}>
                  View all Courses →
                </span>
              </div>
            )}
            <div className="mt-auto">
              <div className="flex items-end gap-1">
                <span
                  className="font-bold leading-none"
                  style={{ fontSize: "5rem", color: course.textColor }}
                >
                  {course.count}
                </span>
                <span
                  className="font-bold text-4xl mb-3"
                  style={{ color: course.textColor }}
                >
                  +
                </span>
              </div>
              <p className="font-semibold text-lg" style={{ color: course.textColor }}>
                {course.label}
              </p>
              <p className="text-sm mt-1 opacity-70" style={{ color: course.textColor }}>
                {course.sublabel}
              </p>
            </div>
          </div>
        )}

       
        {!isActive && (
          <div className="flex items-end gap-1">
            <span
              className="font-bold leading-none"
              style={{ fontSize: "3rem", color: course.textColor }}
            >
              {course.count}
            </span>
            <span className="font-bold text-xl mb-1" style={{ color: course.textColor }}>
              +
            </span>
          </div>
        )}
      </div>
    );
  }
);

CourseCard.displayName = "CourseCard";
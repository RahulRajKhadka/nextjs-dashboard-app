"use client";

import { useState, useRef, useLayoutEffect } from "react";
import CourseCard from "./CourseCard";
import { courseCardsData } from "./courseCardsData";
import gsap from "gsap";

export default function CourseCards() {
  const [expandedId, setExpandedId] = useState<number>(1);
  const [direction, setDirection] = useState<"left" | "right">("right"); 

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const getWidths = () => {
    const container = containerRef.current;
    if (!container) return [];

    const totalWidth = container.clientWidth;
    const gap = 16;
    const totalGap = gap * (courseCardsData.length - 1);
    const availableWidth = totalWidth - totalGap;

    const unit = availableWidth / 3;

    return courseCardsData.map((course) =>
      course.id === expandedId ? unit * 1 : unit * 0.5
    );
  };

  // initial widths
  useLayoutEffect(() => {
    const widths = getWidths();
    cardRefs.current.forEach((el, i) => {
      if (el) gsap.set(el, { width: widths[i] });
    });
  }, []);

  // animate widths
  useLayoutEffect(() => {
    const widths = getWidths();
    cardRefs.current.forEach((el, i) => {
      if (el) {
        gsap.to(el, {
          width: widths[i],
          duration: 0.7,
          ease: "power3.inOut",
        });
      }
    });
  }, [expandedId]);

  return (
    <div
      ref={containerRef}
      className="flex gap-4 w-full p-8 h-[500px]"
    >
      {courseCardsData.map((course, i) => (
        <div
          key={course.id}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="shrink-0 overflow-hidden rounded-3xl"
        >
          <CourseCard
            course={course}
            isExpanded={expandedId === course.id}
            direction={direction} // ✅ NEW
            onClick={() => {
            
              if (course.id > expandedId) {
                setDirection("right");
              } else {
                setDirection("left");
              }
              setExpandedId(course.id);
            }}
          />
        </div>
      ))}
    </div>
  );
}
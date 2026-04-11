"use client";

import { useState, useRef, useLayoutEffect } from "react";
import CourseCard from "./CourseCard";
import { courseCardsData } from "./courseCardsData";
import gsap from "gsap";

export default function CourseCards() {
  const [expandedId, setExpandedId] = useState<number>(1);
  const [directionMap, setDirectionMap] = useState<Map<number, "left" | "right">>(new Map());

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const expandedWidth = useRef(0);
  const collapsedWidth = useRef(0);
  const isAnimating = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = container.clientWidth;
    const gap = 16;
    const totalGap = gap * (courseCardsData.length - 1);
    const unit = (totalWidth - totalGap) / courseCardsData.length;

    expandedWidth.current = unit * 1.4;
    collapsedWidth.current = unit * 0.6;

    const initialDirectionMap = new Map<number, "left" | "right">();
    courseCardsData.forEach((course, index) => {
      initialDirectionMap.set(course.id, index === 0 ? "right" : "left");
    });
    setDirectionMap(initialDirectionMap);

    cardRefs.current.forEach((el, i) => {
      if (el) {
        gsap.set(el, {
          width:
            courseCardsData[i].id === 1
              ? expandedWidth.current
              : collapsedWidth.current,
        });
      }
    });
  }, []);

  const getDirectionForCard = (clickedId: number, currentExpandedId: number): "left" | "right" => {
    const clickedIndex = courseCardsData.findIndex((c) => c.id === clickedId);
    const expandedIndex = courseCardsData.findIndex((c) => c.id === currentExpandedId);
    return clickedIndex < expandedIndex ? "left" : "right";
  };

  const isCardLeftmost = (cardId: number): boolean => {
    return courseCardsData.findIndex((c) => c.id === cardId) === 0;
  };

  const handleCardClick = (courseId: number) => {
    if (courseId === expandedId || isAnimating.current) return;

    const newDirection = getDirectionForCard(courseId, expandedId);
    const prevIndex = courseCardsData.findIndex((c) => c.id === expandedId);
    const newIndex = courseCardsData.findIndex((c) => c.id === courseId);

    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    setDirectionMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(courseId, newDirection);
      return newMap;
    });

  tl.to({}, { duration: 0.08 })

.to(cardRefs.current[prevIndex], {
  width: collapsedWidth.current,
  duration: 0.45,
  ease: "power2.inOut",
})

.to(
  cardRefs.current[newIndex],
  {
    width: expandedWidth.current,
    duration: 0.5,
    ease: "power3.out",
  },
  "-=0.2" // 👈 starts before collapse fully ends
)

.call(() => {
  setExpandedId(courseId);
});
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-4 w-full p-8 bg-blue-500 h-[500px]"
    >
      {courseCardsData.map((course, i) => (
        <div
          key={course.id}
          ref={(el) => (cardRefs.current[i] = el)}
          className="shrink-0 overflow-hidden rounded-3xl"
        >
          <CourseCard
            course={course}
            isExpanded={expandedId === course.id}
            direction={directionMap.get(course.id) || (i === 0 ? "right" : "left")}
            isLeftmost={isCardLeftmost(course.id)}
            onClick={() => handleCardClick(course.id)}
          />
        </div>
      ))}
    </div>
  );
}
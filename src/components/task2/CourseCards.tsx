// src/components/task2/CourseCards.tsx
"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { CourseCard } from "./CourseCard";
import { courseCardsData } from "./courseCardsData";

export default function CourseCards() {
  const [activeId, setActiveId] = useState(1);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimating = useRef(false);

  const handleClick = (clickedId: number) => {
    if (clickedId === activeId || isAnimating.current) return;
    isAnimating.current = true;

    const prevIndex = courseCardsData.findIndex((c) => c.id === activeId);
    const nextIndex = courseCardsData.findIndex((c) => c.id === clickedId);

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveId(clickedId);
        isAnimating.current = false;
      },
    });

    // Shrink currently active card
    tl.to(cardRefs.current[prevIndex], {
      flexBasis: "22.5%",
      duration: 0.5,
      ease: "power3.inOut",
    });

    // Expand clicked card simultaneously
    tl.to(
      cardRefs.current[nextIndex],
      {
        flexBasis: "55%",
        duration: 0.5,
        ease: "power3.inOut",
      },
      "<"
    );
  };

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
        {courseCardsData.map((course, index) => (
          <CourseCard
            key={course.id}
            ref={(el) => { cardRefs.current[index] = el; }}
            course={course}
            isActive={course.id === activeId}
            onClick={() => handleClick(course.id)}
          />
        ))}
      </div>
    </section>
  );
}
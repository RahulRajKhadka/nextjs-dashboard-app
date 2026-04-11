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

  // Compute widths once on mount
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalWidth = container.clientWidth;
    const gap = 16;
    const totalGap = gap * (courseCardsData.length - 1);
    const unit = (totalWidth - totalGap) / courseCardsData.length;

    expandedWidth.current = unit * 1.4;
    collapsedWidth.current = unit * 0.6;

    // Initialize direction map
    const initialDirectionMap = new Map<number, "left" | "right">();
    courseCardsData.forEach((course, index) => {
      const initialDirection = index === 0 ? "right" : "left";
      initialDirectionMap.set(course.id, initialDirection);
    });
    setDirectionMap(initialDirectionMap);

    // Set initial widths
    cardRefs.current.forEach((el, i) => {
      if (el) {
        gsap.set(el, {
          width: courseCardsData[i].id === 1 ? expandedWidth.current : collapsedWidth.current,
        });
      }
    });
  }, []);

  const getDirectionForCard = (clickedId: number, currentExpandedId: number): "left" | "right" => {
    const clickedIndex = courseCardsData.findIndex((c) => c.id === clickedId);
    const expandedIndex = courseCardsData.findIndex((c) => c.id === currentExpandedId);
    
    if (clickedIndex === 0) return "right";
    if (clickedIndex === courseCardsData.length - 1) return "left";
    
    if (clickedIndex < expandedIndex) return "right";
    return "left";
  };

  const isCardLeftmost = (cardId: number): boolean => {
    const index = courseCardsData.findIndex((c) => c.id === cardId);
    return index === 0;
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

    setDirectionMap(prev => {
      const newMap = new Map(prev);
      newMap.set(courseId, newDirection);
      return newMap;
    });

    // Collapse old + expand new simultaneously
    tl.to(cardRefs.current[prevIndex], {
      width: collapsedWidth.current,
      duration: 0.5,
      ease: "power3.inOut",
    })
      .call(() => {
        setExpandedId(courseId);
      })
      .to(
        cardRefs.current[newIndex],
        {
          width: expandedWidth.current,
          duration: 0.5,
          ease: "power3.inOut",
        },
        "<"
      );
  };

  return (
    <div ref={containerRef} className="flex gap-4 w-full p-8 bg-blue-500 h-[500px]">
      {courseCardsData.map((course, i) => (
        <div
          key={course.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
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
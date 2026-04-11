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

    cardRefs.current.forEach((el, i) => {
      if (el) {
        gsap.set(el, {
          width:
            courseCardsData[i].id === expandedId
              ? expandedWidth.current
              : collapsedWidth.current,
        });
      }
    });
  }, []);

  const labelElements = useRef<Map<number, HTMLDivElement>>(new Map());
  const numberElements = useRef<Map<number, HTMLDivElement>>(new Map());

  const setLabelRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) labelElements.current.set(id, el);
    else labelElements.current.delete(id);
  };

  const setNumberRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) numberElements.current.set(id, el);
    else numberElements.current.delete(id);
  };

  const handleClick = (courseId: number) => {
    if (courseId === expandedId || isAnimating.current) return;

    const prevIndex = courseCardsData.findIndex((c) => c.id === expandedId);
    const newIndex = courseCardsData.findIndex((c) => c.id === courseId);
    const newCourse = courseCardsData[newIndex];

    const oldLabel = labelElements.current.get(expandedId);
    const oldNumber = numberElements.current.get(expandedId);
    const newLabel = labelElements.current.get(courseId);
    const newNumber = numberElements.current.get(courseId);

    if (!newLabel || !newNumber) return;

    // direction based on where the clicked card is relative to current
    const newDirection = newIndex > prevIndex ? "left" : "right";
    setDirectionMap(prev => {
      const next = new Map(prev);
      next.set(courseId, newDirection);
      return next;
    });

    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    // Collapse old card width
    tl.to(
      cardRefs.current[prevIndex],
      {
        width: collapsedWidth.current,
        duration: 0.5,
        ease: "power3.inOut",
      },
      0
    );

    // Animate old label back to collapsed
    if (oldLabel) {
      tl.to(
        oldLabel,
        {
          rotation: -90,
          x: 0,
          y: 0,
          color: newCourse.textColor,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0
      );
    }

    // Animate old number color back
    if (oldNumber) {
      tl.to(
        oldNumber,
        {
          color: newCourse.textColor,
          duration: 0.3,
        },
        0
      );
    }

    // Update expanded state at midpoint
    tl.call(() => {
      setExpandedId(courseId);
    }, null, 0.25);

    // Expand new card width
    tl.to(
      cardRefs.current[newIndex],
      {
        width: expandedWidth.current,
        duration: 0.5,
        ease: "power3.inOut",
      },
      0.25
    );

    // Animate new label to expanded position
    const labelRect = newLabel.getBoundingClientRect();
    const numberRect = newNumber.getBoundingClientRect();

    const targetX = numberRect.right + 16 - (labelRect.left + labelRect.width / 2);
    const targetY = numberRect.top + numberRect.height / 2 - (labelRect.top + labelRect.height / 2);

    tl.fromTo(
      newLabel,
      {
        rotation: -90,
        x: 0,
        y: 0,
        color: newCourse.textColor,
      },
      {
        rotation: 0,
        x: targetX,
        y: targetY,
        color: "#ffffff",
        duration: 0.5,
        ease: "back.out(0.3)",
      },
      0.25
    );

    // Animate new number to white
    tl.to(
      newNumber,
      {
        color: "#ffffff",
        duration: 0.3,
      },
      0.4
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex gap-4 box-border w-full my-8 min-h-[200px] md:min-h-[200px] lg:min-h-[400px]"
    >
      {courseCardsData.map((course, i) => (
        <div
          key={course.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          className="shrink-0 overflow-hidden my-auto rounded-3xl"
        >
          <CourseCard
            course={course}
            isExpanded={expandedId === course.id}
            direction={directionMap.get(course.id) ?? "left"}
            isLeftmost={i === 0}
            onClick={() => handleClick(course.id)}
            setLabelRef={setLabelRef(course.id)}
            setNumberRef={setNumberRef(course.id)}
          />
        </div>
      ))}
    </div>
  );
}
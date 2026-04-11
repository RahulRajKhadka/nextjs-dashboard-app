"use client";

import { useState, useRef, useLayoutEffect } from "react";
import CourseCard from "./CourseCard";
import { courseCardsData } from "./courseCardsData";
import gsap from "gsap";

export default function CourseCards() {
  const [expandedId, setExpandedId] = useState<number>(1);
  const [directionMap, setDirectionMap] = useState<Map<number, "left" | "right">>(new Map());

  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]); // Store label refs
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]); // Store number refs
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
      const initialDirection = index === 0 ? "right" : "left";
      initialDirectionMap.set(course.id, initialDirection);
    });
    setDirectionMap(initialDirectionMap);

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

    // Get label and number elements for animation
    const oldLabel = labelRefs.current[prevIndex];
    const newLabel = labelRefs.current[newIndex];
    const oldNumber = numberRefs.current[prevIndex];
    const newNumber = numberRefs.current[newIndex];
    const courseData = courseCardsData[newIndex];

    // Animate old card collapse
    tl.to(cardRefs.current[prevIndex], {
      width: collapsedWidth.current,
      duration: 0.5,
      ease: "power3.inOut",
    }, 0);

    // Animate old label back to collapsed state
    if (oldLabel) {
      tl.to(oldLabel, {
        rotation: -90,
        x: 0,
        y: 0,
        color: courseData.textColor,
        duration: 0.5,
        ease: "power2.inOut",
      }, 0);
    }

    // Animate old number color
    if (oldNumber) {
      tl.to(oldNumber, {
        color: courseData.textColor,
        duration: 0.3,
      }, 0);
    }

    // Update expanded ID mid-timeline
    tl.call(() => {
      setExpandedId(courseId);
    }, null, 0.25);

    // Animate new card expansion
    tl.to(cardRefs.current[newIndex], {
      width: expandedWidth.current,
      duration: 0.5,
      ease: "power3.inOut",
    }, 0.25);

    // Animate new label to expanded position
    if (newLabel && newNumber) {
      const labelRect = newLabel.getBoundingClientRect();
      const numberRect = newNumber.getBoundingClientRect();
      
      const targetX = numberRect.right + 16 - (labelRect.left + labelRect.width / 2);
      const targetY = numberRect.bottom - labelRect.height / 2 - labelRect.top - labelRect.height / 2;
      
      tl.fromTo(newLabel,
        {
          rotation: -90,
          x: 0,
          y: 0,
          color: courseData.textColor,
        },
        {
          rotation: 0,
          x: targetX,
          y: targetY,
          color: "#ffffff",
          duration: 0.5,
          ease: "back.out(0.3)",
        }, 0.25
      );
    }

    // Animate new number color
    if (newNumber) {
      tl.to(newNumber, {
        color: "#ffffff",
        duration: 0.3,
      }, 0.4);
    }
  };

  return (
    <div ref={containerRef} className="flex gap-4 w-full p-8 bg-blue-500 h-full">
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
            isLeftmost={i === 0}
            onClick={() => handleCardClick(course.id)}
            labelRef={(el) => { labelRefs.current[i] = el; }}
            numberRef={(el) => { numberRefs.current[i] = el; }}
          />
        </div>
      ))}
    </div>
  );
}
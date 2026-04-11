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
    <div ref={containerRef} className="flex  gap-4 box-border w-full py-8 bg-blue-500  min-h-[200px] md:min-h-[200px] lg:min-h-[400px] ">
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
} for this one all css for each div and elemetns there and  "use client";

import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import { CourseCard as CourseCardType } from "@/types";
import gsap from "gsap";

interface Props {
  course: CourseCardType;
  isExpanded: boolean;
  onClick: () => void;
  direction: "left" | "right";
  isLeftmost?: boolean;
}

export default function CourseCard({
  course,
  isExpanded,
  onClick,
  direction,
  isLeftmost = false,
}: Props) {
  const numberRef = useRef<HTMLDivElement>(null);
  const collapsedLabelRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const topbarRef = useRef<HTMLDivElement>(null);
  const expandedViewRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!numberRef.current || !collapsedLabelRef.current) return;

    if (isExpanded) {
      // Create a timeline for smooth coordination
      const tl = gsap.timeline();
      
      // Show expanded view
      gsap.set(expandedViewRef.current, { display: "grid" });

      // Measure label and number positions
      const labelRect = collapsedLabelRef.current.getBoundingClientRect();
      const numberRect = numberRef.current.getBoundingClientRect();

      // Calculate target position (beside number with 16px gap)
      const targetX = numberRect.right + 16 - (labelRect.left + labelRect.width / 2);
      const targetY = numberRect.bottom - labelRect.height / 2 - labelRect.top - labelRect.height / 2;

      // 1. Circle wipe animation
      tl.to(circleRef.current, {
        clipPath: "circle(0% at 0% 100%)",
        duration: 1,
        ease: "power3.inOut",
      }, 0);

      // 2. Label animation (rotate + move) - starts at same time
      tl.fromTo(collapsedLabelRef.current,
        {
          rotation: -90,
          x: 0,
          y: 0,
          color: course.textColor,
        },
        {
          rotation: 0,
          x: 180,
          y: 188,
          color: "#ffffff",
          duration: 0.8,
          ease: "back.out(0.3)",
        }, 0
      );

      // 3. Number color change
      tl.to(numberRef.current, {
        color: "#ffffff",
        duration: 0.4,
      }, 0.2);

      // 4. Top bar animation
      const topbarFromX = direction === "left" ? 60 : -60;
      tl.fromTo(topbarRef.current,
        { opacity: 0, y: -15, x: topbarFromX },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        }, 0.3
      );

      // 5. Icons animation (staggered)
      const iconsFromX = direction === "left" ? 120 : -120;
      gsap.set(iconsRef.current, { x: iconsFromX, opacity: 0 });
      iconsRef.current.forEach((icon, i) => {
        tl.to(icon, {
          x: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        }, 0.4 + i * 0.08);
      });

    } else {
      // COLLAPSE ANIMATIONS - Smooth reverse
      const tl = gsap.timeline();

      // 1. Circle expands back
      tl.to(circleRef.current, {
        clipPath: "circle(130% at 0% 80%)",
        duration: 0.8,
        ease: "power3.inOut",
      }, 0);

      // 2. Label returns to collapsed position
      tl.to(collapsedLabelRef.current, {
        rotation: -90,
        x: 0,
        y: 0,
        color: course.textColor,
        duration: 0.6,
        ease: "power2.inOut",
      }, 0);

      // 3. Number color returns
      tl.to(numberRef.current, {
        color: course.textColor,
        duration: 0.3,
      }, 0.1);

      // 4. Hide expanded view
      tl.set(expandedViewRef.current, { 
        display: "none" 
      }, 0.3);

      // 5. Reset icons and topbar
      tl.set(iconsRef.current, { 
        clearProps: "x,opacity" 
      }, 0.4);
      
      tl.set(topbarRef.current, { 
        clearProps: "x,y,opacity" 
      }, 0.4);
    }
  }, [isExpanded, direction, course.textColor]);

  return (
    <div
      onClick={onClick}
      className="relative rounded-3xl p-8 overflow-hidden cursor-pointer h-full w-full"
      style={{ backgroundColor: course.bgExpanded }}
    >
      {/* Background circle */}
      <div
        ref={circleRef}
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: course.bg,
          clipPath: "circle(150% at 0% 100%)",
        }}
      />

      {/* NUMBER — always bottom-left */}
      <div className="absolute bottom-0 left-6 z-[3] flex items-end p-4 pointer-events-none">
        <div ref={numberRef} className="flex items-end" style={{ color: course.textColor }}>
          <span
            className="font-black leading-none"
            style={{
              fontSize: "clamp(3.5rem,7vw,5.5rem)",
              color: "inherit",
            }}
          >
            {String(course.count).padStart(2, "0")}
          </span>
          <span className="font-black text-3xl mb-2 ml-1" style={{ color: "inherit" }}>
            +
          </span>
        </div>
      </div>

      {/* SINGLE LABEL — starts centered, rotates and moves on expand */}
      <div className="absolute  inset-0 z-[4]  flex items-center  pointer-events-none">
        <div
          ref={collapsedLabelRef}
          className="flex flex-col gap-1"
          style={{
            transform: "rotate(-90deg)",
            color: course.textColor,
          }}
        >
          <span className="font-bold text-[20px] whitespace-nowrap" style={{ color: "inherit" }}>
            {course.label}
          </span>
          <p className="text-[15px] opacity-60 whitespace-nowrap" style={{ color: "inherit" }}>
            {course.sublabel}
          </p>
        </div>
      </div>

      {/* EXPANDED VIEW — topbar + icons only */}
      <div
        ref={expandedViewRef}
        className="absolute inset-0 z-[2] p-5"
        style={{
          display: isExpanded ? "grid" : "none",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        {/* Row 1: topbar */}
        <div ref={topbarRef} className="flex justify-end mt-40 opacity-0">
          <span className="text-white/80 text-sm font-medium tracking-wide">
            View all Courses →
          </span>
        </div>

        {/* Row 2: icons */}
        <div className="flex gap-4 items-center justify-center">
          {course.icons?.map((iconPath, i) => (
            <span
              key={i}
              ref={(el) => (iconsRef.current[i] = el)}
              className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Image src={iconPath} alt="" width={32} height={32} className="opacity-80" />
            </span>
          ))}
        </div>

        {/* Row 3: empty spacer */}
        <div className="h-20" />
      </div>
    </div>
  );
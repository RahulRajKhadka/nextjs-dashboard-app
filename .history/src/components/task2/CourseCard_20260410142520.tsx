"use client";

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

      // 2. Label animation (using CALCULATED position, not hardcoded)
      tl.fromTo(collapsedLabelRef.current,
        {
          rotation: -90,
          x: 0,
          y: 0,
          color: course.textColor,
        },
        {
          rotation: 0,
          x: targetX,  // ← CALCULATED position
          y: targetY,  // ← CALCULATED position
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

      // 5. Icons animation - FIXED: ensure they animate from sides
      const iconsFromX = direction === "left" ? 120 : -120;
      iconsRef.current.forEach((icon, i) => {
        // Set initial position
        gsap.set(icon, { x: iconsFromX, opacity: 0 });
        // Animate to center
        tl.to(icon, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(0.3)",
        }, 0.35 + i * 0.1);
      });

    } else {
      // COLLAPSE ANIMATIONS
      const tl = gsap.timeline();

      tl.to(circleRef.current, {
        clipPath: "circle(130% at 0% 80%)",
        duration: 0.8,
        ease: "power3.inOut",
      }, 0);

      tl.to(collapsedLabelRef.current, {
        rotation: -90,
        x: 0,
        y: 0,
        color: course.textColor,
        duration: 0.6,
        ease: "power2.inOut",
      }, 0);

      tl.to(numberRef.current, {
        color: course.textColor,
        duration: 0.3,
      }, 0.1);

      tl.set(expandedViewRef.current, { 
        display: "none" 
      }, 0.3);

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
      className="relative rounded-3xl overflow-hidden cursor-pointer h-full w-full"
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

      {/* COLLAPSED STATE: Number and Label stacked vertically in CENTER */}
      {!isExpanded && (
        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center pointer-events-none">
          {/* LABEL - rotated -90°, centered */}
          <div
            ref={collapsedLabelRef}
            className="flex flex-col gap-1 mb-6"
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

          {/* NUMBER - below label, centered */}
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
      )}

      {/* EXPANDED STATE: Show label at new position (handled by GSAP) */}
      {isExpanded && (
        <div
          ref={collapsedLabelRef}
          className="absolute z-[3] flex flex-col gap-1 pointer-events-none"
          style={{
            color: "#ffffff",
          }}
        >
          <span className="font-bold text-[20px] whitespace-nowrap">
            {course.label}
          </span>
          <p className="text-[15px] opacity-60 whitespace-nowrap">
            {course.sublabel}
          </p>
        </div>
      )}

      {/* NUMBER in expanded state (still at bottom-left) */}
      {isExpanded && (
        <div className="absolute bottom-0 left-6 z-[3] flex items-end p-4 pointer-events-none">
          <div className="flex items-end" style={{ color: "#ffffff" }}>
            <span
              className="font-black leading-none"
              style={{
                fontSize: "clamp(3.5rem,7vw,5.5rem)",
              }}
            >
              {String(course.count).padStart(2, "0")}
            </span>
            <span className="font-black text-3xl mb-2 ml-1">
              +
            </span>
          </div>
        </div>
      )}

      {/* EXPANDED VIEW - topbar + icons */}
      <div
        ref={expandedViewRef}
        className="absolute inset-0 z-[2] p-5"
        style={{
          display: isExpanded ? "grid" : "none",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        {/* Top bar */}
        <div ref={topbarRef} className="flex justify-end mt-40 opacity-0">
          <span className="text-white/80 text-sm font-medium tracking-wide">
            View all Courses →
          </span>
        </div>

        {/* Icons - centered */}
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

        <div className="h-20" />
      </div>
    </div>
  );
}
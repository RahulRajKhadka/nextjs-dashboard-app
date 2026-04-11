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
    // 1. Capture the label's current position in the collapsed card
    const labelRect = collapsedLabelRef.current.getBoundingClientRect();
    const parentRect = collapsedLabelRef.current.parentElement!.getBoundingClientRect();
    
    // Store original offset relative to parent
    const originalLeft = labelRect.left - parentRect.left;
    const originalTop = labelRect.top - parentRect.top;
    
    // 2. Pin the label to that exact position using transform
    gsap.set(collapsedLabelRef.current, {
      x: originalLeft - (labelRect.width / 2), // adjust for center
      y: originalTop - (labelRect.height / 2),
      rotation: -90,
    });
    
    // 3. Now measure the target position (beside number)
    const numberRect = numberRef.current.getBoundingClientRect();
    const targetX = numberRect.right + 12 - (labelRect.left + labelRect.width / 2);
    const targetY = numberRect.bottom - labelRect.height / 2 - labelRect.top - labelRect.height / 2;
    
    // 4. Show expanded view (but label stays pinned)
    gsap.set(expandedViewRef.current, { display: "grid" });
    
    // 5. Animate from pinned position to target
    gsap.to(collapsedLabelRef.current, {
      x: targetX,
      y: targetY,
      rotation: 0,
      color: "#ffffff",
      duration: 1.0,
      delay: 0.2,
      ease: "power2.inOut",
    });
    
    // rest of your animations (circle, topbar, icons)...
  } else {
    // Collapse: animate back to original pinned position
    gsap.to(collapsedLabelRef.current, {
      x: 0,
      y: 0,
      rotation: -90,
      color: course.textColor,
      duration: 0.8,
    });
    // ...
  }
}, [isExpanded, direction]);
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

      {/* SINGLE LABEL — always center, rotates and travels on expand */}
      <div className="absolute inset-0 z-[4]  pointer-events-none">
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
        <div ref={topbarRef} className="flex justify-end mt-40">
          <span className="text-white/80 text-sm">View all Courses →</span>
        </div>

        {/* Row 2: icons */}
        <div className="flex gap-3 items-center">
          {course.icons?.map((iconPath, i) => (
            <span
              key={i}
              ref={(el) => (iconsRef.current[i] = el)}
              className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center"
            >
              <Image src={iconPath} alt="" width={36} height={36} />
            </span>
          ))}
        </div>

        {/* Row 3: empty — number and label are absolute, they land here */}
        <div className="h-24" />
      </div>
    </div>
  );
}
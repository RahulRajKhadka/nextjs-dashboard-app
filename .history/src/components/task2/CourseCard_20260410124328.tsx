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
  const expandedLabelDestinationRef = useRef<HTMLDivElement>(null); // Target position in expanded card
  const iconsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const topbarRef = useRef<HTMLDivElement>(null);
  const expandedViewRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!numberRef.current || !collapsedLabelRef.current) return;

    if (isExpanded) {
      // 1. First, show expanded view (but hide it visually)
      gsap.set(expandedViewRef.current, { 
        display: "grid",
        opacity: 0  // Hidden but takes up space for measurements
      });
      
      // 2. Force browser to calculate expanded layout
      // This ensures all expanded card measurements are correct
      
      // 3. Measure target position from EXPANDED card layout
      const labelRect = collapsedLabelRef.current.getBoundingClientRect();
      const destinationRect = expandedLabelDestinationRef.current.getBoundingClientRect();
      
      // Calculate how far the label needs to move
      const deltaX = destinationRect.left - labelRect.left;
      const deltaY = destinationRect.top - labelRect.top;
      
      // 4. Hide expanded view again for animation
      gsap.set(expandedViewRef.current, { opacity: 1 });
      
      // 5. Now animate the label to the target position
      gsap.to(collapsedLabelRef.current, {
        x: deltaX,
        y: deltaY,
        rotation: 0,
        color: "#ffffff",
        duration: 1.0,
        delay: 0.2,
        ease: "power2.inOut",
        onComplete: () => {
          // Show other elements
          gsap.to(topbarRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.5,
          });
          
          iconsRef.current.forEach((icon, i) => {
            gsap.to(icon, {
              y: 0,
              opacity: 1,
              duration: 0.4,
              delay: i * 0.1,
            });
          });
        },
      });
      
      // Circle animation
      gsap.to(circleRef.current, {
        clipPath: "circle(0% at 0% 100%)",
        duration: 1.5,
        ease: "power3.inOut",
      });
      
      // Number color
      gsap.to(numberRef.current, {
        color: "#ffffff",
        duration: 0.5,
        delay: 0.2,
      });
      
    } else {
      // Collapse
      gsap.to(collapsedLabelRef.current, {
        x: 0,
        y: 0,
        rotation: -90,
        color: course.textColor,
        duration: 0.8,
      });
      
      gsap.to(circleRef.current, {
        clipPath: "circle(130% at 0% 80%)",
        duration: 0.7,
      });
      
      gsap.to(numberRef.current, {
        color: course.textColor,
        duration: 0.4,
      });
      
      gsap.set(expandedViewRef.current, { display: "none", delay: 0.2 });
      gsap.set(iconsRef.current, { clearProps: "y,opacity" });
      gsap.set(topbarRef.current, { clearProps: "y,opacity" });
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

      {/* SINGLE LABEL — starts centered, will animate to destination */}
      <div className="absolute inset-0 z-[4] flex items-center justify-center pointer-events-none">
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

      {/* DESTINATION MARKER - Where label should end up in expanded card */}
      <div
        ref={expandedLabelDestinationRef}
        className="absolute z-[1] pointer-events-none"
        style={{
          // Position exactly where you want the label to land in expanded card
          left: "clamp(8rem, 14vw, 11rem)",  // After the spacer
          bottom: "1.5rem",                   // Bottom of card
          opacity: 0,
        }}
      >
        <div className="flex flex-col">
          <span className="font-bold text-white whitespace-nowrap">{course.label}</span>
          <p className="text-white/70 text-xs whitespace-nowrap">{course.sublabel}</p>
        </div>
      </div>

      {/* EXPANDED VIEW — topbar + icons only (no duplicate label) */}
      <div
        ref={expandedViewRef}
        className="absolute inset-0 z-[2] p-5"
        style={{
          display: "none",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        {/* Top bar */}
        <div ref={topbarRef} className="flex justify-end mt-40">
          <span className="text-white/80 text-sm">View all Courses →</span>
        </div>

        {/* Icons */}
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

        {/* Empty spacer - label will animate to destination marker */}
        <div className="h-24" />
      </div>
    </div>
  );
}
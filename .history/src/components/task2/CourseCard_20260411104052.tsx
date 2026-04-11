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
  setLabelRef: (el: HTMLDivElement | null) => void;
  setNumberRef: (el: HTMLDivElement | null) => void;
}

export default function CourseCard({
  course,
  isExpanded,
  onClick,
  direction,
  isLeftmost = false,
  setLabelRef,
  setNumberRef,
}: Props) {
  const numberRef = useRef<HTMLDivElement>(null);
  const collapsedLabelRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const topbarRef = useRef<HTMLDivElement>(null);
  const expandedViewRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  // Pass refs to parent when they become available
  useLayoutEffect(() => {
    setLabelRef(collapsedLabelRef.current);
    setNumberRef(numberRef.current);
  }, [setLabelRef, setNumberRef]);

  useLayoutEffect(() => {
    if (!numberRef.current || !circleRef.current) return;

    if (isExpanded) {
      const tl = gsap.timeline();

      // Show expanded view
      gsap.set(expandedViewRef.current, { display: "grid" });

      // 1. Circle wipe
      tl.to(circleRef.current, {
        clipPath: "circle(0% at 0% 100%)",
        duration: 0.8,
        ease: "power3.inOut",
      }, 0);

      // 2. Number colour change (label is handled by parent)
      tl.to(numberRef.current, {
        color: "#ffffff",
        duration: 0.3,
      }, 0.2);

      // 3. Topbar animation
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

      // 4. Icons staggered animation
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
      // COLLAPSE
      const tl = gsap.timeline();

      // 1. Circle expands back
      tl.to(circleRef.current, {
        clipPath: "circle(130% at 0% 80%)",
        duration: 0.6,
        ease: "power3.inOut",
      }, 0);

      // 2. Number colour returns (label is handled by parent)
      tl.to(numberRef.current, {
        color: course.textColor,
        duration: 0.3,
      }, 0.1);

      // 3. Hide expanded view after animations
      tl.set(expandedViewRef.current, { display: "none" }, 0.3);

      // 4. Reset icons and topbar
      tl.set(iconsRef.current, { clearProps: "x,opacity" }, 0.4);
      tl.set(topbarRef.current, { clearProps: "x,y,opacity" }, 0.4);
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

      {/* COLLAPSED CONTENT: flex column centered */}
      <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center pointer-events-none">
        {/* Rotated label */}
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

        {/* Number (below label) */}
        <div ref={numberRef} className="mt-4" style={{ color: course.textColor }}>
          <div className="flex items-end">
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
      </div>

      {/* EXPANDED VIEW (topbar + icons) – unchanged */}
      <div
        ref={expandedViewRef}
        className="absolute inset-0 z-[2] p-5"
        style={{
          display: isExpanded ? "grid" : "none",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <div ref={topbarRef} className="flex justify-end mt-40 opacity-0">
          <span className="text-white/80 text-sm font-medium tracking-wide">
            View all Courses →
          </span>
        </div>
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
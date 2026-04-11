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

      // 1. Show expanded view (so we can measure positions)
      gsap.set(expandedViewRef.current, { display: "grid" });

      // Measure label and number positions
      const labelRect = collapsedLabelRef.current.getBoundingClientRect();
      const numberRect = numberRef.current.getBoundingClientRect();
      const gap = 16; // desired gap between label bottom and number top
      // Calculate how far to move label down so its bottom is 'gap' above number top
      const deltaY = (numberRect.top - gap) - labelRect.bottom;

      // 2. Circle wipe
      tl.to(circleRef.current, {
        clipPath: "circle(0% at 0% 100%)",
        duration: 0.8,
        ease: "power3.inOut",
      }, 0);

      // 3. Label slide down + colour change
      tl.fromTo(collapsedLabelRef.current,
        { y: 0, color: course.textColor },
        { y: deltaY, color: "#ffffff", duration: 0.5, ease: "power2.out" },
        0
      );

      // 4. Number colour change
      tl.to(numberRef.current, {
        color: "#ffffff",
        duration: 0.3,
      }, 0.2);

      // 5. Topbar slide in
      const topbarFromX = direction === "left" ? 60 : -60;
      tl.fromTo(topbarRef.current,
        { opacity: 0, y: -15, x: topbarFromX },
        { opacity: 1, y: 0, x: 0, duration: 0.5, ease: "power2.out" },
        0.3
      );

      // 6. Icons staggered
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

      // 2. Label slides back up + colour returns
      tl.to(collapsedLabelRef.current, {
        y: 0,
        color: course.textColor,
        duration: 0.4,
        ease: "power2.inOut",
      }, 0);

      // 3. Number colour returns
      tl.to(numberRef.current, {
        color: course.textColor,
        duration: 0.3,
      }, 0.1);

      // 4. Hide expanded view after animations
      tl.set(expandedViewRef.current, { display: "none" }, 0.3);

      // 5. Reset icons and topbar
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

      {/* COLLAPSED CONTENT: flex column with label at top, number at bottom */}
      <div className="relative z-[3] flex flex-col justify-between h-full p-6 pointer-events-none">
        {/* Label + sublabel (normal orientation, no rotation) */}
        <div ref={collapsedLabelRef} className="flex flex-col gap-1" style={{ color: course.textColor }}>
          <span className="font-bold text-[20px]" style={{ color: "inherit" }}>
            {course.label}
          </span>
          <p className="text-[15px] opacity-60" style={{ color: "inherit" }}>
            {course.sublabel}
          </p>
        </div>

        {/* Number (bottom‑right) */}
        <div ref={numberRef} className="flex justify-end" style={{ color: course.textColor }}>
          <div className="flex items-end">
            <span
              className="font-black leading-none"
              style={{ fontSize: "clamp(3.5rem,7vw,5.5rem)", color: "inherit" }}
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
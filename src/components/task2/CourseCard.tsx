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
}

export default function CourseCard({
  course,
  isExpanded,
  onClick,
  direction,
}: Props) {
  const numberRef = useRef<HTMLDivElement>(null);
  const collapsedLabelRef = useRef<HTMLDivElement>(null);
  const expandedLabelRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const topbarRef = useRef<HTMLDivElement>(null);
  const expandedViewRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const fromX = direction === "right" ? -150 : 150;

    if (isExpanded) {
      // number slides left
      gsap.to(numberRef.current, {
        x: -80,
        duration: 0.6,
        ease: "power3.inOut",
      });

      // hide collapsed label
      gsap.to(collapsedLabelRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
      });

      // show expanded view
      gsap.set(expandedViewRef.current, { display: "grid" });

      // topbar
      gsap.fromTo(
        topbarRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.4, delay: 0.2 }
      );

      // 🔥 ICONS — direction based entry
      gsap.set(iconsRef.current, { x: fromX, opacity: 0 });

      iconsRef.current.forEach((icon, i) => {
        gsap.to(icon, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.25 + i * 0.1,
        });
      });

      // expanded label
      gsap.fromTo(
        expandedLabelRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, delay: 0.3 }
      );
    } else {
      // reset number
      gsap.to(numberRef.current, {
        x: 0,
        duration: 0.6,
      });

      // hide expanded view
      gsap.set(expandedViewRef.current, { display: "none", delay: 0.2 });

      // show collapsed label
      gsap.to(collapsedLabelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        delay: 0.1,
      });
    }
  }, [isExpanded, direction]);

  return (
    <div
      onClick={onClick}
      className="relative rounded-3xl overflow-hidden cursor-pointer h-full w-full"
      style={{ backgroundColor: course.bg }}
    >
      {/* NUMBER */}
      <div className="absolute bottom-0 left-0 right-0 z-[3] flex items-end justify-center p-4">
        <div ref={numberRef} className="flex items-end">
          <span
            className="font-black leading-none"
            style={{
              color: course.textColor,
              fontSize: "clamp(3.5rem,7vw,5.5rem)",
            }}
          >
            {String(course.count).padStart(2, "0")}
          </span>
          <span
            className="font-black text-3xl mb-2 ml-1"
            style={{ color: course.textColor }}
          >
            +
          </span>
        </div>
      </div>

      {/* COLLAPSED */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <div
          ref={collapsedLabelRef}
          className="flex flex-col gap-1"
          style={{ transform: "rotate(-90deg)" }}
        >
          <span
            className="font-bold text-[13px]"
            style={{ color: course.textColor }}
          >
            {course.label}
          </span>
          <p
            className="text-[11px] opacity-60"
            style={{ color: course.textColor }}
          >
            {course.sublabel}
          </p>
        </div>
      </div>

      {/* EXPANDED */}
      <div
        ref={expandedViewRef}
        className="absolute inset-0 z-[2] p-5"
        style={{
          display: isExpanded ? "grid" : "none",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        {/* topbar */}
        <div ref={topbarRef} className="flex justify-end">
          <span className="text-white/80 text-sm">
            View all Courses →
          </span>
        </div>

        {/* icons */}
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

        {/* bottom */}
        <div className="flex items-end gap-4">
          <div style={{ width: "clamp(8rem,14vw,11rem)" }} />
          <div ref={expandedLabelRef}>
            <span className="text-white font-bold">
              {course.label}
            </span>
            <p className="text-white/70 text-xs">
              {course.sublabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
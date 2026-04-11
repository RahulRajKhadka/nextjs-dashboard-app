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
  const circleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const fromX = direction === "right" ? -150 : 150;

    if (isExpanded) {
      gsap.to(circleRef.current, {
        clipPath: "circle(0% at 0% 100%)",
        duration: 1.5,
        ease: "power3.inOut",
      });

      gsap.to(numberRef.current, {
        x: -150,
        duration: 1.1,
        ease: "power1.inOut",
      });

      gsap.to(collapsedLabelRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.8,
        ease: "power2.in",
      });

      gsap.set(expandedViewRef.current, { display: "grid" });

      const topbarFromX = direction === "left" ? 80 : 0;
      gsap.fromTo(
        topbarRef.current,
        { opacity: 0, y: -10, x: topbarFromX },
        { opacity: 1, y: 0, x: 0, duration: 0.5, delay: 0.25, ease: "power2.out" }
      );

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

      gsap.fromTo(
        expandedLabelRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, delay: 0.3 }
      );
    } else {
      gsap.to(circleRef.current, {
        clipPath: "circle(130% at 0% 80%)",
        duration: 0.7,
        ease: "power3.inOut",
      });

      gsap.to(numberRef.current, {
        x: 0,
        duration: 0.6,
      });

      gsap.set(expandedViewRef.current, { display: "none", delay: 0.2 });
      gsap.set(topbarRef.current, { x: 0 });

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
      style={{ backgroundColor: course.bgExpanded }}
    >
      {/* PINK CIRCLE */}
      <div
        ref={circleRef}
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: course.bg,
          clipPath: "circle(150% at 0% 100%)",
        }}
      />

    
      <div className="absolute bottom-0 left-0 right-0 z-[3] flex items-end justify-center p-4">
        <div ref={numberRef} className="flex items-end">
          <span
            className="font-black leading-none"
            style={{
              color: isExpanded ? "#ffffff" : course.textColor,
              fontSize: "clamp(3.5rem,7vw,5.5rem)",
            }}
          >
            {String(course.count).padStart(2, "0")}
          </span>
          <span
            className="font-black text-3xl mb-2 ml-1"
            style={{ color: isExpanded ? "#ffffff" : course.textColor }}
          >
            +
          </span>
        </div>
      </div>

      {/* COLLAPSED VIEW */}
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

      {/* EXPANDED VIEW */}
      <div
        ref={expandedViewRef}
        className="absolute inset-0 z-[2] p-5"
        style={{
          display: isExpanded ? "grid" : "none",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        <div ref={topbarRef} className="flex justify-end mt-40">
          <span className="text-white/80 text-sm">View all Courses →</span>
        </div>

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

        <div className="flex items-end gap-4">
          <div style={{ width: "clamp(8rem,14vw,11rem)" }} />
          <div ref={expandedLabelRef}>
            <span className="text-white font-bold">{course.label}</span>
            <p className="text-white/70 text-xs">{course.sublabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
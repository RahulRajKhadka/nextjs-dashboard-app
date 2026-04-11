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
  labelRef?: (el: HTMLDivElement | null) => void;
  numberRef?: (el: HTMLDivElement | null) => void;
}

export default function CourseCard({
  course,
  isExpanded,
  onClick,
  direction,
  isLeftmost = false,
  labelRef,
  numberRef,
}: Props) {
  const iconsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const topbarRef = useRef<HTMLDivElement>(null);
  const expandedViewRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const internalLabelRef = useRef<HTMLDivElement>(null);
  const internalNumberRef = useRef<HTMLDivElement>(null);

  const setLabelRef = (el: HTMLDivElement | null) => {
    internalLabelRef.current = el;
    if (labelRef) labelRef(el);
  };

  const setNumberRef = (el: HTMLDivElement | null) => {
    internalNumberRef.current = el;
    if (numberRef) numberRef(el);
  };

  useLayoutEffect(() => {
    if (isExpanded) {
      // Show expanded view
      gsap.set(expandedViewRef.current, { display: "grid" });

      // Circle wipe
      gsap.to(circleRef.current, {
        clipPath: "circle(0% at 0% 100%)",
        duration: 0.8,
        ease: "power3.inOut",
      });

      // Top bar animation
      const topbarFromX = direction === "left" ? 60 : -60;
      gsap.fromTo(topbarRef.current,
        { opacity: 0, y: -15, x: topbarFromX },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.5,
          delay: 0.2,
          ease: "power2.out",
        }
      );

      // Icons animation
      const iconsFromX = direction === "left" ? 120 : -120;
      gsap.set(iconsRef.current, { x: iconsFromX, opacity: 0 });
      iconsRef.current.forEach((icon, i) => {
        gsap.to(icon, {
          x: 0,
          opacity: 1,
          duration: 0.4,
          delay: 0.3 + i * 0.08,
          ease: "power2.out",
        });
      });
    } else {
      // Collapse
      gsap.to(circleRef.current, {
        clipPath: "circle(130% at 0% 80%)",
        duration: 0.6,
        ease: "power3.inOut",
      });

      gsap.set(expandedViewRef.current, { display: "none", delay: 0.2 });
      gsap.set(iconsRef.current, { clearProps: "x,opacity" });
      gsap.set(topbarRef.current, { clearProps: "x,y,opacity" });
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
        <div ref={setNumberRef} className="flex items-end" style={{ color: course.textColor }}>
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

      {/* SINGLE LABEL — Only show when collapsed, hide when expanded */}
      {!isExpanded && (
        <div className="absolute inset-0 z-[4] flex items-center justify-center pointer-events-none">
          <div
            ref={setLabelRef}
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
      )}

      {/* EXPANDED VIEW - Higher z-index to show above everything */}
      <div
        ref={expandedViewRef}
        className="absolute inset-0 z-[5] p-5"
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
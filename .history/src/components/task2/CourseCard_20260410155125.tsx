"use client";

import Image from "next/image";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { CourseCard as CourseCardType } from "@/types";

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
  const labelRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const topbarRef = useRef<HTMLDivElement>(null);
  const expandedViewRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!numberRef.current || !labelRef.current) return;

    const tl = gsap.timeline();

    if (isExpanded) {
      // Show expanded content first (but hidden)
      gsap.set(expandedViewRef.current, { display: "grid" });

      const labelRect = labelRef.current.getBoundingClientRect();
      const numberRect = numberRef.current.getBoundingClientRect();

      const targetX = numberRect.left - labelRect.left;
      const targetY = numberRect.top - labelRect.top;

      // Slight pause feeling (important)
      tl.to({}, { duration: 0.08 });

      // 1. Circle wipe
      tl.to(circleRef.current, {
        clipPath: "circle(0% at 0% 100%)",
        duration: 0.9,
        ease: "power3.inOut",
      });

      // 2. Label rotate + move
      tl.to(
        labelRef.current,
        {
          rotation: 0,
          x: targetX,
          y: targetY,
          color: "#ffffff",
          duration: 0.75,
          ease: "back.out(1.2)",
        },
        "-=0.6"
      );

      // 3. Number color
      tl.to(
        numberRef.current,
        {
          color: "#ffffff",
          duration: 0.3,
        },
        "-=0.5"
      );

      // 4. Topbar
      const fromX = direction === "left" ? 60 : -60;

      tl.fromTo(
        topbarRef.current,
        { opacity: 0, y: -20, x: fromX },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3"
      );

      // 5. Icons stagger
      const iconsFromX = direction === "left" ? 100 : -100;

      gsap.set(iconsRef.current, { x: iconsFromX, opacity: 0 });

      iconsRef.current.forEach((icon, i) => {
        tl.to(
          icon,
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          `-=${0.35 - i * 0.05}`
        );
      });
    } else {
      // COLLAPSE

      tl.to(circleRef.current, {
        clipPath: "circle(140% at 0% 100%)",
        duration: 0.8,
        ease: "power3.inOut",
      });

      tl.to(
        labelRef.current,
        {
          rotation: -90,
          x: 0,
          y: 0,
          color: course.textColor,
          duration: 0.6,
          ease: "power2.inOut",
        },
        "-=0.6"
      );

      tl.to(
        numberRef.current,
        {
          color: course.textColor,
          duration: 0.3,
        },
        "-=0.5"
      );

      tl.to(
        iconsRef.current,
        {
          opacity: 0,
          x: direction === "left" ? 80 : -80,
          duration: 0.3,
          stagger: 0.03,
        },
        "-=0.4"
      );

      tl.to(
        topbarRef.current,
        {
          opacity: 0,
          y: -10,
          duration: 0.3,
        },
        "-=0.4"
      );

      tl.set(expandedViewRef.current, { display: "none" });
    }
  }, [isExpanded, direction, course.textColor]);

  return (
    <div
      onClick={onClick}
      className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer"
      style={{ backgroundColor: course.bgExpanded }}
    >
      {/* Circle background */}
      <div
        ref={circleRef}
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: course.bg,
          clipPath: "circle(150% at 0% 100%)",
        }}
      />

      {/* COLLAPSED LAYOUT */}
      {!isExpanded && (
        <div className="absolute inset-0 z-[3] flex flex-col items-center justify-between py-8 pointer-events-none">
          <div />

          {/* LABEL */}
          <div
            ref={labelRef}
            className="flex flex-col items-center gap-1"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              color: course.textColor,
            }}
          >
            <span className="font-bold text-[20px] whitespace-nowrap">
              {course.label}
            </span>
            <p className="text-[15px] opacity-60 whitespace-nowrap">
              {course.sublabel}
            </p>
          </div>

          {/* NUMBER */}
          <div
            ref={numberRef}
            className="flex items-end"
            style={{ color: course.textColor }}
          >
            <span
              className="font-black leading-none"
              style={{
                fontSize: "clamp(3.5rem,7vw,5.5rem)",
              }}
            >
              {String(course.count).padStart(2, "0")}
            </span>
            <span className="font-black text-3xl mb-2 ml-1">+</span>
          </div>
        </div>
      )}

      {/* EXPANDED VIEW */}
      <div
        ref={expandedViewRef}
        className="absolute inset-0 z-[2] p-6"
        style={{
          display: "none",
          gridTemplateRows: "auto 1fr auto",
        }}
      >
        {/* Topbar */}
        <div ref={topbarRef} className="flex justify-end opacity-0">
          <span className="text-white/80 text-sm">
            View all Courses →
          </span>
        </div>

        {/* Icons */}
        <div className="flex items-center justify-center gap-4">
          {course.icons?.map((icon, i) => (
            <span
              key={i}
              ref={(el) => (iconsRef.current[i] = el)}
              className="w-14 h-14 rounded-2xl bg-white/90 flex items-center justify-center shadow-lg"
            >
              <Image src={icon} alt="" width={28} height={28} />
            </span>
          ))}
        </div>

        <div />
      </div>
    </div>
  );
}
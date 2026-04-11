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
      // Show expanded view first so we can measure
      gsap.set(expandedViewRef.current, { display: "grid" });

      // Measure delta: label center → beside number (bottom-left)
      const labelRect = collapsedLabelRef.current.getBoundingClientRect();
      const numberRect = numberRef.current.getBoundingClientRect();

      // We want label to land to the RIGHT of the number
      const targetX = numberRect.right + 40 - (labelRect.left + labelRect.width / 2);
      const targetY = numberRect.bottom - labelRect.height / 2 - labelRect.top - labelRect.height / 2;

      // Circle wipe
      gsap.to(circleRef.current, {
        clipPath: "circle(0% at 0% 100%)",
        duration: 1.5,
        ease: "power3.inOut",
      });

      // Topbar
      const topbarFromX = direction === "left" ? 80 : -80;
      gsap.fromTo(
        topbarRef.current,
        { opacity: 0, y: -10, x: topbarFromX },
        { opacity: 1, y: 0, x: 0, duration: 0.5, delay: 0.25 }
      );

      // Icons
      const iconsFromX = direction === "left" ? 150 : -150;
      gsap.set(iconsRef.current, { x: iconsFromX, opacity: 0 });
      iconsRef.current.forEach((icon, i) => {
        gsap.to(icon, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.25 + i * 0.1,
        });
      });

      // Number color
      gsap.to(numberRef.current, {
        color: "#ffffff",
        duration: 0.5,
        delay: 0.2,
      });

      // Label: rotate -90 → 0 while traveling right to beside the number
      gsap.fromTo(
        collapsedLabelRef.current,
        {
          rotation: -90,
          x: 0,
          y: 0,
          color: course.textColor,
        },
        {
          rotation: 0,
          x: 200,
          y: 200,
          color: "#ffffff",
          duration: 2,
          delay: 0,
          ease: "power2.inOut",
        }
      );
    } else {
      // Circle back
      gsap.to(circleRef.current, {
        clipPath: "circle(130% at 0% 80%)",
        duration: 0.7,
      });

      gsap.set(expandedViewRef.current, { display: "none", delay: 0.3 });

      // Number color back
      gsap.to(numberRef.current, {
        color: course.textColor,
        duration: 0.4,
      });

      // Label travels back and rotates back to -90
      gsap.to(collapsedLabelRef.current, {
        rotation: -90,
        x: 0,
        y: 0,
        color: course.textColor,
        duration: 2,
        ease: "power2.inOut",
      });
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
      <div className="absolute inset-0 z-[4] flex items-center  pointer-events-none">
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
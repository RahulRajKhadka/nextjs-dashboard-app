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
  const labelContainerRef = useRef<HTMLDivElement>(null);  // ← ONE ref for both states
  const iconsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const topbarRef = useRef<HTMLDivElement>(null);
  const expandedViewRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!labelContainerRef.current) return;

    if (isExpanded) {
      // Measure collapsed position
      const collapsedRect = labelContainerRef.current.getBoundingClientRect();
      
      // Store the target expanded position (will be measured after layout)
      requestAnimationFrame(() => {
        const expandedRect = labelContainerRef.current!.getBoundingClientRect();
        
        // Calculate transforms needed to go from collapsed → expanded
        const deltaX = collapsedRect.left - expandedRect.left;
        const deltaY = collapsedRect.top - expandedRect.top;
        
        // Start from collapsed position/rotation, animate to expanded
        gsap.fromTo(
          labelContainerRef.current,
          {
            x: deltaX,
            y: deltaY,
            rotation: -90,  // collapsed rotation
            opacity: 1
          },
          {
            x: 0,
            y: 0,
            rotation: 0,    // expanded rotation
            opacity: 1,
            duration: 1.2,
            ease: "power3.inOut"
          }
        );
      });

      // Rest of your animations...
      gsap.to(circleRef.current, {
        clipPath: "circle(0% at 0% 100%)",
        duration: 1.5,
        ease: "power3.inOut",
      });

      gsap.set(expandedViewRef.current, { display: "grid" });

      // Animate topbar and icons...
      const topbarFromX = direction === "left" ? 80 : -80;
      const iconsFromX = direction === "left" ? 150 : -150;

      gsap.fromTo(
        topbarRef.current,
        { opacity: 0, y: -10, x: topbarFromX },
        { opacity: 1, y: 0, x: 0, duration: 0.5, delay: 0.25 }
      );

      gsap.set(iconsRef.current, { x: iconsFromX, opacity: 0 });
      iconsRef.current.forEach((icon, i) => {
        gsap.to(icon, {
          x: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.25 + i * 0.1,
        });
      });

    } else {
      // Collapsing - animate back to collapsed position
      const expandedRect = labelContainerRef.current.getBoundingClientRect();
      
      requestAnimationFrame(() => {
        // Force collapsed layout temporarily
        labelContainerRef.current!.style.position = 'absolute';
        
        const collapsedRect = labelContainerRef.current!.getBoundingClientRect();
        const deltaX = expandedRect.left - collapsedRect.left;
        const deltaY = expandedRect.top - collapsedRect.top;
        
        gsap.fromTo(
          labelContainerRef.current,
          {
            x: 0,
            y: 0,
            rotation: 0,
          },
          {
            x: deltaX,
            y: deltaY,
            rotation: -90,
            duration: 0.8,
            ease: "power2.in",
            onComplete: () => {
              labelContainerRef.current!.style.position = '';
            }
          }
        );
      });

      gsap.to(circleRef.current, {
        clipPath: "circle(130% at 0% 80%)",
        duration: 0.7,
      });

      gsap.set(expandedViewRef.current, { display: "none", delay: 0.2 });
    }
  }, [isExpanded, direction]);

  return (
    <div
      onClick={onClick}
      className="relative rounded-3xl overflow-hidden cursor-pointer h-full w-full"
      style={{ backgroundColor: course.bgExpanded }}
    >
      <div
        ref={circleRef}
        className="absolute inset-0 z-[1]"
        style={{
          backgroundColor: course.bg,
          clipPath: "circle(150% at 0% 100%)",
        }}
      />

      {/* NUMBER */}
      <div className="absolute bottom-0 left-6 z-[3] flex items-end p-4">
        <div ref={numberRef} className="flex items-end">
          <span
            className="font-black leading-none"
            style={{
              color: isExpanded ? "#fff" : course.textColor,
              fontSize: "clamp(3.5rem,7vw,5.5rem)",
            }}
          >
            {String(course.count).padStart(2, "0")}
          </span>
          <span
            className="font-black text-3xl mb-2 ml-1"
            style={{ color: isExpanded ? "#fff" : course.textColor }}
          >
            +
          </span>
        </div>
      </div>

      {/* SINGLE LABEL that transforms */}
      <div 
        ref={labelContainerRef}
        className="absolute z-[2] flex flex-col gap-1"
        style={{
          // Collapsed position (centered)
          top: isExpanded ? 'auto' : '50%',
          left: isExpanded ? 'auto' : '50%',
          bottom: isExpanded ? '2rem' : 'auto',
          right: isExpanded ? 'auto' : 'auto',
          transform: isExpanded 
            ? 'translateX(0)' 
            : 'translate(-50%, -50%)',
          color: isExpanded ? 'white' : course.textColor,
        }}
      >
        <span className="font-bold text-[13px] md:text-base">
          {course.label}
        </span>
        <p className="text-[11px] md:text-xs opacity-60">
          {course.sublabel}
        </p>
      </div>

      {/* Expanded view container (for icons and topbar) */}
      <div
        ref={expandedViewRef}
        className="absolute inset-0 z-[2] p-5"
        style={{
          display: isExpanded ? "grid" : "none",
          gridTemplateRows: "auto 1fr auto",
          pointerEvents: isExpanded ? 'auto' : 'none',
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

        {/* Empty spacer - label now positioned absolutely */}
        <div className="h-20" />
      </div>
    </div>
  );
}
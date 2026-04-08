// src/components/task1/JourneyCard.tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { JourneyCard as JourneyCardType } from "@/types";

interface JourneyCardProps {
  card: JourneyCardType;
}

export function JourneyCard({ card }: JourneyCardProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const handleMouseEnter = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.to(frontRef.current, { x: "-110%", opacity: 0, duration: 0.4, ease: "power2.in" })
      .fromTo(
        backRef.current,
        { x: "110%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.05"
      );
  };

  const handleMouseLeave = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
      },
    });

    tl.to(backRef.current, { x: "110%", opacity: 0, duration: 0.4, ease: "power2.in" })
      .fromTo(
        frontRef.current,
        { x: "-110%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.4, ease: "power2.out" },
        "-=0.05"
      );
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden min-h-[280px] cursor-pointer"
      style={{ backgroundColor: card.bg }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
    
      <div
        ref={frontRef}
        className="absolute inset-0 p-8 flex flex-col justify-between transition-all duration-500 ease-in-out"
      >
        <div>
          <h3 className="text-white text-2xl font-bold mb-1">{card.title}</h3>
          <p className="text-white text-base font-medium opacity-90 mb-4">{card.subtitle}</p>
          <p className="text-white text-sm opacity-75 leading-relaxed">{card.description}</p>
        </div>
      </div>

      {/* BACK */}
      <div
        ref={backRef}
        className="absolute inset-0 flex items-center transition-all duration-500 ease-in-out"
        style={{ transform: "translateX(110%)", opacity: 0 }}
      >
        <button className="absolute left-[-1.5rem] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 z-20">
          ←
        </button>

        <div className="flex-shrink-0 w-[45%] h-full flex items-end justify-center overflow-hidden">
          <div className="w-full h-full flex items-center justify-center opacity-30" style={{ backgroundColor: "rgba(0,0,0,0.15)" }}>
            <span className="text-6xl">👤</span>
          </div>
        </div>

        <div className="absolute top-4 left-12 w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
          {card.stickers[0]}
        </div>

        <div className="absolute bottom-4 left-[38%] w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
          {card.stickers[1]}
        </div>

        <div className="flex-1 px-6 py-8">
          <p className="text-white font-bold text-xl leading-snug">{card.quote}</p>
        </div>

        <button className="absolute right-[-1.5rem] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 z-20">
          →
        </button>
      </div>
    </div>
  );
}
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { JourneyCard as JourneyCardType } from "@/types";

interface JourneyCardProps {
  card: JourneyCardType;
  hasAnimation?: boolean;
}

export function JourneyCard({ card, hasAnimation = true }: JourneyCardProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const handleMouseEnter = () => {
    if (!hasAnimation) return;
    tweenRef.current?.kill();

    tweenRef.current = gsap.to(frontRef.current, {
      x: "-100%",
      opacity: 0,
      duration: 1.2,
      ease: "none", // perfectly linear — fade matches movement 1:1
    });
  };

  const handleMouseLeave = () => {
    if (!hasAnimation) return;
    tweenRef.current?.kill();

    // Reverse from exactly where it currently is
    tweenRef.current = gsap.to(frontRef.current, {
      x: "0%",
      opacity: 1,
      duration: 1.2,
      ease: "none",
    });
  };

  return (
    // No overflow:hidden — card travels freely
    <div
      className="relative rounded-3xl min-h-[280px] cursor-pointer"
      style={{ backgroundColor: card.bg }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* BACK — always sitting in place, never moves */}
      <div
        className="absolute inset-0 flex items-center"
        style={{ zIndex: 1 }}
      >
        <div className="absolute inset-0 bg-[url('/images/clarityback.svg')] bg-cover bg-center" />

        <button className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 z-20">
          ←
        </button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 z-20">
          →
        </button>

        <div className="flex-shrink-0 w-[45%] h-full flex items-end justify-center overflow-hidden relative z-10">
          <img
            src="/images/doing.svg"
            alt="visual"
            className="h-full object-contain opacity-90"
          />
        </div>

        <div className="absolute top-4 left-16 w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm z-20">
          {card.stickers[0]}
        </div>
        <div className="absolute bottom-4 left-[40%] w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm z-20">
          {card.stickers[1]}
        </div>

        <div className="flex-1 px-6 py-8 relative z-10">
          <p className="text-white font-bold text-xl leading-snug">
            {card.quote}
          </p>
        </div>
      </div>

      {/* FRONT — slides left + fades freely on hover */}
      <div
        ref={frontRef}
        className="absolute inset-0 p-8 flex items-center gap-6"
        style={{ zIndex: 2, backgroundColor: card.bg }}
      >
        <div className="w-[40%] flex justify-center items-center">
          <img
            src="/images/doing.svg"
            alt="illustration"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="w-[60%]">
          <h3 className="text-white text-2xl font-bold mb-2">
            {card.title}
          </h3>
          <p className="text-white text-base font-medium opacity-90 mb-3">
            {card.subtitle}
          </p>
          <p className="text-white text-sm opacity-80 leading-relaxed">
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
}
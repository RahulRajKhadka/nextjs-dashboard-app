// src/components/task1/JourneyCard.tsx
"use client";
import { useRef } from "react";
import gsap from "gsap";
import { JourneyCard as JourneyCardType } from "@/types";

interface JourneyCardProps {
  card: JourneyCardType;
  hasAnimation?: boolean; // New prop to control animation
}

export function JourneyCard({ card, hasAnimation = true }: JourneyCardProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  const handleMouseEnter = () => {
    if (!hasAnimation) return; // Skip animation if not enabled
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
    if (!hasAnimation) return; // Skip animation if not enabled
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
  className="absolute inset-0 p-8 flex items-center gap-6 transition-all duration-500 ease-in-out"
>

  <div className="w-[40%] flex justify-center items-center">
    <img
      src="/images/doing.svg"
      alt="illustration"
      className="w-full h-auto object-contain"
    />
  </div>

  {/* RIGHT: TEXT CONTENT */}
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

  {/* BACK */}
<div
  ref={backRef}
  className="absolute inset-0 flex items-center transition-all duration-500 ease-in-out translate-x-[110%] opacity-0"
>
  
  <div className="absolute inset-0 bg-[url('/images/clarityback.svg')] bg-cover bg-center" />

  <button className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 z-20">
    ←
  </button>

  {/* RIGHT ARROW (inside curve) */}
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

  {/* TEXT */}
  <div className="flex-1 px-6 py-8 relative z-10">
    <p className="text-white font-bold text-xl leading-snug">
      {card.quote}
    </p>
  </div>
</div>
    </div>
  );
}
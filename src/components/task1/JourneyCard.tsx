"use client";
import Image from "next/image";
import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { JourneyCard as JourneyCardType } from "@/types";

interface JourneyCardProps {
  card: JourneyCardType;
  hasAnimation?: boolean;
}

// ─── Notched card wrapper ───────────────────────────────────────────
function NotchedCard({
  bg,
  children,
}: {
  bg: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const updateClip = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const W = el.offsetWidth;
    const H = el.offsetHeight;

    const r  = 20;
    const nr = 72;
    const ns = 45;
    const sm = 3;
    const ny = H / 2;
    const fl = 24;

    const path = [
      `M ${r} 0`,
      `L ${W - r} 0`,
      `Q ${W} 0 ${W} ${r}`,
      `L ${W} ${ny - ns - fl}`,
      `Q ${W} ${ny - ns} ${W - fl} ${ny - ns}`,
      `C ${W - fl} ${ny - ns + sm}  ${W - nr} ${ny - ns + sm}  ${W - nr} ${ny}`,
      `C ${W - nr} ${ny + ns - sm}  ${W - fl} ${ny + ns - sm}  ${W - fl} ${ny + ns}`,
      `Q ${W} ${ny + ns} ${W} ${ny + ns + fl}`,
      `L ${W} ${H - r}`,
      `Q ${W} ${H} ${W - r} ${H}`,
      `L ${r} ${H}`,
      `Q 0 ${H} 0 ${H - r}`,
      `L 0 ${ny + ns + fl}`,
      `Q 0 ${ny + ns} ${fl} ${ny + ns}`,
      `C ${fl} ${ny + ns - sm}  ${nr} ${ny + ns - sm}  ${nr} ${ny}`,
      `C ${nr} ${ny - ns + sm}  ${fl} ${ny - ns + sm}  ${fl} ${ny - ns}`,
      `Q 0 ${ny - ns} 0 ${ny - ns - fl}`,
      `L 0 ${r}`,
      `Q 0 0 ${r} 0`,
      `Z`,
    ].join(" ");

    el.style.clipPath = `path('${path}')`;
  }, []);

  useEffect(() => {
    updateClip();
    const ro = new ResizeObserver(updateClip);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [updateClip]);

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{ backgroundColor: bg, borderRadius: 24 }}
    >
      {children}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────
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
      ease: "none",
    });
  };

  const handleMouseLeave = () => {
    if (!hasAnimation) return;
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(frontRef.current, {
      x: "0%",
      opacity: 1,
      duration: 1.2,
      ease: "none",
    });
  };

  return (
    <div
      className="relative rounded-3xl h-[200px] md:h-[220px] lg:h-[250px] cursor-pointer overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ================= BACK ================= */}
      <div className="absolute px-10 w-full inset-0" style={{ zIndex: 1 }}>

        {/* LEFT ARROW BUTTON */}
        <button
          className="absolute left-7 top-1/2 -translate-y-1/2 -translate-x-1/2
                     w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] md:w-[60px] md:h-[60px]
                     rounded-full bg-white shadow-lg
                     flex items-center justify-center hover:bg-gray-100 z-30"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* RIGHT ARROW BUTTON */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                     w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] md:w-[60px] md:h-[60px]
                     rounded-full bg-white shadow-lg
                     flex items-center justify-center hover:bg-gray-100 z-30"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
            fill="none"
            stroke="#1a1a2e"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <NotchedCard bg={card.bg}>

          {/* TOP LEFT WOW ICON */}
          <div className="absolute top-[6%] left-[4%] z-20 rotate-[-10deg]">
            <Image
              src="/images/wowicon.svg"
              alt="wow"
              width={80}
              height={80}
              className="w-8 sm:w-10 md:w-12 lg:w-16 h-auto"
            />
          </div>

          {/* BOTTOM RIGHT WOW ICON */}
          <div className="absolute bottom-[6%] right-[5%] z-20 rotate-[15deg]">
            <Image
              src="/images/wowicon.svg"
              alt="wow"
              width={80}
              height={80}
              className="w-8 sm:w-10 md:w-12 lg:w-16 h-auto"
            />
          </div>

          {/* MAIN CONTENT: image + quote side by side */}
          <div className="relative flex items-end h-full z-10">

            {/* PERSON / ILLUSTRATION IMAGE */}
            <div className="shrink-0 flex items-end pl-4 sm:pl-6 md:pl-8">
              <img
                src="/images/clarityback.svg"
                alt="illustration"
                className="h-28 sm:h-36 md:h-44 lg:h-52 object-contain"
              />
            </div>

            {/* QUOTE TEXT */}
            <div className="flex-1 flex items-center h-full px-3 sm:px-4 md:px-6 pb-4">
              <p className="text-white font-bold text-xs sm:text-sm md:text-base leading-snug">
                {card.quote}
              </p>
            </div>

          </div>

        </NotchedCard>
      </div>

      {/* ================= FRONT (hover reveal) ================= */}
      <div
        ref={frontRef}
        className="absolute inset-0 p-6 sm:p-7 md:p-8 flex items-center gap-4 sm:gap-5 md:gap-6 rounded-3xl"
        style={{ zIndex: 40, backgroundColor: card.bg }}
      >
        <div className="w-[40%] flex justify-center items-center">
          <img
            src="/images/doing.svg"
            alt="illustration"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="w-[60%]">
          <h3 className="text-white font-bold leading-tight
                         text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">
            {card.title}
          </h3>
          <p className="text-white font-medium opacity-90
                        text-xs sm:text-sm md:text-base mb-2 sm:mb-3">
            {card.subtitle}
          </p>
          <p className="text-white opacity-80 leading-relaxed
                        text-xs sm:text-sm">
            {card.description}
          </p>
        </div>
      </div>

    </div>
  );
}
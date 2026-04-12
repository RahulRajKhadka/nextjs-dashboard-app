"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import gsap from "gsap";
import { JourneyCard as JourneyCardType } from "@/types";
import { NotchedCard } from "./Notchcard";

interface JourneyCardProps {
  card: JourneyCardType;
  hasAnimation?: boolean;
}

export function JourneyCard({ card, hasAnimation = true }: JourneyCardProps) {
  const frontRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % (card.slides?.length || 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide(
      (prev) =>
        (prev - 1 + (card.slides?.length || 1)) % (card.slides?.length || 1),
    );
  };

  const handleMouseEnter = () => {
    if (!hasAnimation) return;
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(frontRef.current, {
      x: "-100%",
      opacity: 0,
      duration: 1.2,
      ease: "power3.inOut",
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

  const activeSlide = card?.slides?.[currentSlide];

  return (
    <div
      className="relative rounded-3xl h-60 md:h-65 lg:h-70 cursor-pointer overflow-visible"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute px-10 w-full inset-0" style={{ zIndex: 1 }}>
        <button
          onClick={prevSlide}
          className="absolute left-7 top-1/2 -translate-y-1/2 -translate-x-1/2
                     w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] md:w-[60px] md:h-[60px]
                     rounded-full bg-white shadow-lg
                     flex items-center justify-center hover:bg-gray-100 z-30 cursor-pointer"
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

        <button
          onClick={nextSlide}
          className="absolute right-[32px] top-1/2 -translate-y-1/2 translate-x-1/2
                     w-[44px] h-[44px] sm:w-[52px] sm:h-[52px] md:w-[60px] md:h-[60px]
                     rounded-full bg-white shadow-lg
                     flex items-center justify-center hover:bg-gray-100 z-30 cursor-pointer"
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
          <div className="relative w-full h-full p-6 overflow-visible">
            {activeSlide?.stickers?.map((sticker: any, index: number) => (
              <div
                key={index}
                className="absolute z-30"
                style={{
                  top: sticker.top,
                  bottom: sticker.bottom,
                  left: sticker.left,
                  right: sticker.right,
                  transform: `rotate(${sticker.rotate})`,
                }}
              >
                <img
                  src={sticker.src}
                  alt="sticker"
                  className="w-12 md:w-16 h-auto"
                />
              </div>
            ))}

            <img
              src={activeSlide?.image}
              alt="illustration"
              className="absolute object-contain z-10"
              style={{
                ...activeSlide?.imageStyle,
                position: "absolute",
              }}
            />

            <p
              className="absolute z-20 font-bold text-white leading-tight"
              style={{
                ...activeSlide?.textStyle,
                position: "absolute",
              }}
            >
              {activeSlide?.text}
            </p>
          </div>
        </NotchedCard>
      </div>

      <div
        ref={frontRef}
        className={`absolute h-full inset-0 p-6 sm:p-7 md:p-8 flex items-center gap-4 sm:gap-5 md:gap-6 rounded-2xl ${
          card.id % 2 === 0 ? "flex-row-reverse" : "flex-row"
        }`}
        style={{
          zIndex: 40,
          backgroundColor: card.bg,
          padding:
            card.id % 2 === 0
              ? "1.75rem 2.25rem 1.75rem 1.25rem"
              : "1.75rem 1.25rem 1.75rem 2.25rem",
        }}
      >
        <div className="w-[40%] flex flex-1 justify-center items-center">
          <img
            src={card.illustration}
            alt="illustration"
            className="absolute object-contain"
            style={{
              top: card.styles?.top ?? undefined,
              left: card.styles?.left ?? undefined,
              height: card.styles?.height ?? undefined,
              width: card.styles?.width ?? undefined,
            }}
          />
        </div>
        <div
          className={` h-full flex flex-2 flex-col justify-center items-stretch ${
            card.id % 2 !== 0
              ? "text-right items-end "
              : "text-left items-start"
          }`}
        >
          <h3
            className="font-nohemi text-white font-bold leading-tight
                         text-[32px] sm:text-xl md:text-2xl whitespace-nowrap"
          >
            {card.title}
          </h3>
          <p
            style={{ marginTop: "10px" }}
            className="text-white font-medium opacity-90
                        sm:text-sm md:text-base text-2xl"
          >
            {card.subtitle}
          </p>
          <p
            style={{ marginTop: "32px" }}
            className="text-white opacity-80 ml-20 leading-relaxed
                        text-xs sm:text-sm"
          >
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
}

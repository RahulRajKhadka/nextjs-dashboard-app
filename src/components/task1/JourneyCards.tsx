"use client";
import { useState } from "react";

const cards = [
  {
    id: 1,
    title: "Start with Clarity",
    subtitle: "Step into a better learning path.",
    description:
      "Overwhelmed by too many learning options? SkillShikshya provides a clear, curated roadmap from the start. Whether you're a beginner or upskilling, we have a path tailored to your growth.",
    bg: "#D94F3D",
    quote: "Clarity unlocked— stickers, sips, and skills all in one go!",
    stickers: ["💬", "🤩"],
  },
  {
    id: 2,
    title: "Learn by Doing",
    subtitle: "Practical skills, real projects.",
    description:
      "Theory is great, but action is better. At SkillShikshya, you learn by doing. Hands-on projects and real-world scenarios help you build, break, and create—leading to true mastery.",
    bg: "#3B8C8C",
    quote: "Real projects, real skills— learning that actually sticks!",
    stickers: ["🚀", "✨"],
  },
  {
    id: 3,
    title: "Get Mentored & Supported",
    subtitle: "You're not learning alone.",
    description:
      "Stuck or need feedback? SkillShikshya's community of mentors and learners has your back with live support, interactive discussions, and expert insights. You're never on your own.",
    bg: "#7B6FD4",
    quote: "Your mentor is just a message away— never stuck, always growing!",
    stickers: ["🙌", "💡"],
  },
  {
    id: 4,
    title: "Achieve & Showcase",
    subtitle: "Build your portfolio, get job-ready.",
    description:
      "Your journey ends with achievement. Each completed project builds a portfolio showcasing your skills and job readiness, bringing you closer to that dream job, promotion, or your own venture.",
    bg: "#B5A642",
    quote: "Portfolio built, confidence earned— you're job-ready now!",
    stickers: ["🏆", "🎯"],
  },
];

// Curved notch arrow button
function ArrowButton({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
      style={{
        [direction === "left" ? "left" : "right"]: "-1.5rem",
      }}
    >
      {direction === "left" ? "←" : "→"}
    </button>
  );
}

// Floating sticker bubble
function StickerBubble({
  emoji,
  style,
}: {
  emoji: string;
  style: React.CSSProperties;
}) {
  return (
    <div
      className="absolute w-14 h-14 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm pointer-events-none"
      style={style}
    >
      {emoji}
    </div>
  );
}

function JourneyCard({ card }: { card: (typeof cards)[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-3xl overflow-hidden min-h-[280px] cursor-pointer"
      style={{ backgroundColor: card.bg }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* FRONT FACE */}
      <div
        className="absolute inset-0 p-8 flex flex-col justify-between transition-all duration-500 ease-in-out"
        style={{
          transform: hovered ? "translateX(-110%)" : "translateX(0%)",
          opacity: hovered ? 0 : 1,
        }}
      >
        <div>
          <h3 className="text-white text-2xl font-bold mb-1">{card.title}</h3>
          <p className="text-white text-base font-medium opacity-90 mb-4">
            {card.subtitle}
          </p>
          <p className="text-white text-sm opacity-75 leading-relaxed">
            {card.description}
          </p>
        </div>
      </div>

      {/* BACK FACE — image banner style */}
      <div
        className="absolute inset-0 flex items-center transition-all duration-500 ease-in-out"
        style={{
          transform: hovered ? "translateX(0%)" : "translateX(110%)",
          opacity: hovered ? 1 : 0,
        }}
      >
        {/* Left arrow */}
        <ArrowButton direction="left" />

        {/* Person image placeholder */}
        <div
          className="h-full flex-shrink-0 flex items-end justify-center overflow-hidden"
          style={{ width: "45%" }}
        >
          <div
            className="w-full h-full flex items-center justify-center opacity-30"
            style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
          >
            {/* Placeholder until real image is added */}
            <span className="text-white text-6xl">👤</span>
          </div>
        </div>

        {/* Sticker 1 — top left area */}
        <StickerBubble
          emoji={card.stickers[0]}
          style={{ top: "1rem", left: "3rem" }}
        />

        {/* Sticker 2 — bottom right of image area */}
        <StickerBubble
          emoji={card.stickers[1]}
          style={{ bottom: "1rem", left: "38%" }}
        />

        {/* Quote text */}
        <div className="flex-1 px-6 py-8">
          <p className="text-white font-bold text-xl leading-snug">
            {card.quote}
          </p>
        </div>

        {/* Right arrow */}
        <ArrowButton direction="right" />
      </div>
    </div>
  );
}

export default function JourneyCards() {
  return (
    <section className="px-6 py-10 max-w-5xl mx-auto">
      <p className="text-gray-500 text-sm mb-1">Your SkillShikshya Journey</p>
      <h2 className="text-3xl font-bold mb-10">
        <span className="text-[#2E9E6B]">Step</span>{" "}
        <span className="text-gray-800">In.</span>{" "}
        <span className="text-[#D94F3D]">Skill</span>{" "}
        <span className="text-gray-800">Up.</span>{" "}
        <span className="text-gray-800">Stand Out.</span>{" "}
        <span>🚀</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card) => (
          <JourneyCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
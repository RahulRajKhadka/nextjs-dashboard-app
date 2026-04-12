// src/components/task1/journeyCardsData.ts
import { JourneyCard } from "@/types";

export const journeyCardsData: JourneyCard[] = [
  {
    id: 1,
    title: "Start with Clarity",
    subtitle: "Step into a better learning path.",
    styles: {
      top: "20px",
      left: "-90px",
      height: "20rem",
      width: "20rem",
    },
    illustration: "/images/clarity.svg",
    slides: [
      {
        text: "Clarity unlocked— stickers, sips, and skills all in one go!",
        textStyle: {
          top: "80px",
          right: "12%",
          width: "32%",
          textAlign: "left",
        },
        image: "/images/clarityback.svg",
        imageStyle: { top: "10px", left: "55px", height: "85%", zIndex: 999 },
        stickers: [
          { src: "/images/wowicon.svg", top: "10%", left: "10%", rotate: "-15deg" },
          {
            src: "/images/wowicon.svg",
            bottom: "10%",
            right: "20%",
            rotate: "10deg",
          },
        ],
      },
    ],
    description:
      "Overwhelmed by too many learning options? SkillShikshya provides a clear, curated roadmap from the start. Whether you're a beginner or upskilling, we have a path tailored to your growth.",
    bg: "#D94F3D",
    stickers: ["💬", "🤩"],
  },
  {
    id: 2,
    title: "Learn by Doing",
    subtitle: "Practical skills, real projects.",
    illustration: "/images/doing.svg",
    slides: [
      {
        text: "Focused faces—learning mode: ON!",
        textStyle: {
          top: "15%",
          left: '12%',
           width: "35%",
          textAlign: "left",
        },
        image: "/images/people.png",
        imageStyle: { bottom: "0px", left: "22%", height: "85%" },
        stickers: [],
      },
      {
        text: "Laptops, lessons, and a whole lot of growth!",
        textStyle: {
          top: "15%",
          right: "26%",
          width: "45%",
          textAlign: "center",
        },
        image: "/images/group.png",
        imageStyle: { bottom: "15px", left: "15%", height: "85%" },
        stickers: [],
      },
    ],
    styles: {
      top: "20px",
      left: "285px",
      height: "22rem",
      width: "22rem",
    },
    description:
      "Theory is great, but action is better. At SkillShikshya, you learn by doing. Hands-on projects and real-world scenarios help you build, break, and create—leading to true mastery.",
    bg: "#3B8C8C",
    stickers: ["🚀", "✨"],
  },
  {
    id: 3,
    title: "Get Mentored & Supported",
    subtitle: "You're not learning alone.",
    illustration: "/images/mentor.svg",
    styles: {
      top: "40px",
      left: "-65px",
      height: "20rem",
      width: "20rem",
    },
    description:
      "Stuck or need feedback? SkillShikshya’s community of mentors and learners has your back with live support, interactive discussions, and expert insights. You’re never on your own.",
    bg: "#7B6FD4",
    stickers: ["🙌", "💡"],
  },
  {
    id: 4,
    title: "Achieve & Showcase",
    illustration: "/images/showcase.svg",
    subtitle: "Build your portfolio, get job-ready.",
    styles: {
      top: "20px",
      left: "320px",
      height: "18rem",
      width: "18rem",
    },
    description:
      "Your journey ends with achievement. Each completed project builds a portfolio showcasing your skills and job readiness, bringing you closer to that dream job, promotion, or your own venture.",
    bg: "#B5A642",
    stickers: ["🏆", "🎯"],
  },
];

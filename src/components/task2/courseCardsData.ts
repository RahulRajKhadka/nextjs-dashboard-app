// src/components/task2/courseCardsData.ts
import { CourseCard } from "@/types";

export const courseCardsData: CourseCard[] = [
  {
    id: 1,
    count: "23",
    label: "All Courses",
    sublabel: "courses you're powering through right now.",
    bg: "#D94F3D",
    textColor: "white",
    icons: ["⚛️", "💬", "🟩", "🪁"],
  },
  {
    id: 2,
    count: "05",
    label: "Upcoming Courses",
    sublabel: "exciting new courses waiting to boost your skills.",
    bg: "#FAE8E6",
    textColor: "#D94F3D",
  },
  {
    id: 3,
    count: "10",
    label: "Ongoing Courses",
    sublabel: "currently happening—don't miss out on the action!",
    bg: "#FAE8E6",
    textColor: "#D94F3D",
  },
];
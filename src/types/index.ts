export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
  };
  address: {
    city: string;
    street: string;
  };
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface NewPost {
  title: string;
  body: string;
}

// src/types/index.ts
export interface JourneyCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  bg: string;
  quote: string;
  stickers: [string, string];
}

export interface CourseCard {
  id: number;
  count: string;
  label: string;
  sublabel: string;
  bg: string;
  textColor: string;
  icons?: string[]; // ← SVG paths as strings
}
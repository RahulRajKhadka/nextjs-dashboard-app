xport interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}
 
export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
}
 
export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  phone: string;
  website: string;
  company: Company;
  address: Address;
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

// Task1 and Task 2
export interface JourneyCard {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  bg: string;
  stickers: [string, string];
  styles?: any
  slides?: Slide[];
  illustration?: string; // ← Optional field for SVG paths or image URLs
}

export interface Slide {
  text: string;
  textStyle: any;
  image: string;
  imageStyle: any;
  stickers: any[];
}




export interface CourseCard {
  id: number;
  count: string;
  label: string;
  sublabel: string;
  bg: string;
  textColor: string;
  icons?: string[];
  bgExpanded: string; 
}

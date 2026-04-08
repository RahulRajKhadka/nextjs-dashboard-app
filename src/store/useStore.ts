import { create } from "zustand";
import { User, Post } from "@/types";

interface StoreState {
  users: User[];
  posts: Post[];
  localPosts: Post[];
  searchQuery: string;
  setUsers: (users: User[]) => void;
  setPosts: (posts: Post[]) => void;
  addLocalPost: (post: Post) => void;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  users: [],
  posts: [],
  localPosts: [],
  searchQuery: "",
  setUsers: (users) => set({ users }),
  setPosts: (posts) => set({ posts }),
  addLocalPost: (post) =>
    set((state) => ({ localPosts: [post, ...state.localPosts] })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
import { create } from "zustand";
import { User, Post, NewPost } from "@/types";



interface DashboardStore {
  // Users
  users: User[];
  apiIsLoading: boolean;
  error: string | null;
  setUsers: (users: User[]) => void;
  setApiIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Posts
  posts: Post[];
  postsLoading: boolean;
  postsError: string | null;
  setPosts: (posts: Post[]) => void;
  setPostsLoading: (loading: boolean) => void;
  setPostsError: (error: string | null) => void;

  
  localPosts: Post[];
  addLocalPost: (userId: number, post: NewPost) => void;
  loadLocalPosts: (userId: number) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // Users
  users: [],
  apiIsLoading: false,
  error: null,
  setUsers: (users) => set({ users }),
  setApiIsLoading: (apiIsLoading) => set({ apiIsLoading }),
  setError: (error) => set({ error }),

  // Posts
  posts: [],
  postsLoading: false,
  postsError: null,
  setPosts: (posts) => set({ posts }),
  setPostsLoading: (postsLoading) => set({ postsLoading }),
  setPostsError: (postsError) => set({ postsError }),

  
  localPosts: [],
  addLocalPost: (userId, newPost) => {
    const existing: Post[] = JSON.parse(
      localStorage.getItem(`localPosts_${userId}`) || "[]"
    );
    const post: Post = {
      id: Date.now(),
      userId,
      title: newPost.title,
      body: newPost.body,
    };
    const updated = [post, ...existing];
    localStorage.setItem(`localPosts_${userId}`, JSON.stringify(updated));
    set({ localPosts: updated });
  },
  loadLocalPosts: (userId) => {
    const stored: Post[] = JSON.parse(
      localStorage.getItem(`localPosts_${userId}`) || "[]"
    );
    set({ localPosts: stored });
  },

  // Search
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
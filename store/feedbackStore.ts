import { createStore } from "zustand";
import { Sentiment } from "@/types";

export type SentimentFilter = Sentiment | "All";

export interface FeedbackState {
  searchQuery: string;
  activeSentiment: SentimentFilter;
  setSearchQuery: (q: string) => void;
  setActiveSentiment: (s: SentimentFilter) => void;
}

export const createFeedbackStore = () =>
  createStore<FeedbackState>((set) => ({
    searchQuery: "",
    activeSentiment: "All",
    setSearchQuery: (q) => set({ searchQuery: q }),
    setActiveSentiment: (s) => set({ activeSentiment: s }),
  }));

export type FeedbackStore = ReturnType<typeof createFeedbackStore>;

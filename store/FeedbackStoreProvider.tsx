"use client";

import { createContext, useContext, useState } from "react";
import { useStore } from "zustand";
import {
  createFeedbackStore,
  type FeedbackState,
  type FeedbackStore,
} from "./feedbackStore";

const FeedbackStoreContext = createContext<FeedbackStore | null>(null);

export function FeedbackStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<FeedbackStore>(() => createFeedbackStore());
  return (
    <FeedbackStoreContext.Provider value={store}>
      {children}
    </FeedbackStoreContext.Provider>
  );
}

export function useFeedbackStore<T>(selector: (state: FeedbackState) => T): T {
  const store = useContext(FeedbackStoreContext);
  if (!store) {
    throw new Error(
      "useFeedbackStore must be used within FeedbackStoreProvider",
    );
  }
  return useStore(store, selector);
}

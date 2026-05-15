import { describe, it, expect } from "vitest";
import { createFeedbackStore } from "@/store/feedbackStore";

describe("createFeedbackStore", () => {
  it("starts with empty search query and 'All' sentiment", () => {
    const store = createFeedbackStore();
    const state = store.getState();
    expect(state.searchQuery).toBe("");
    expect(state.activeSentiment).toBe("All");
  });

  it("updates the search query when setSearchQuery is called", () => {
    const store = createFeedbackStore();
    store.getState().setSearchQuery("james");
    expect(store.getState().searchQuery).toBe("james");
  });

  it("updates the active sentiment when setActiveSentiment is called", () => {
    const store = createFeedbackStore();
    store.getState().setActiveSentiment("Negative");
    expect(store.getState().activeSentiment).toBe("Negative");
  });

  it("setting one field does not modify the other", () => {
    const store = createFeedbackStore();
    store.getState().setSearchQuery("hello");
    expect(store.getState().activeSentiment).toBe("All");

    store.getState().setActiveSentiment("Positive");
    expect(store.getState().searchQuery).toBe("hello");
  });

  it("creates independent stores on each call (no shared global state)", () => {
    const storeA = createFeedbackStore();
    const storeB = createFeedbackStore();

    storeA.getState().setSearchQuery("query in A");
    storeA.getState().setActiveSentiment("Positive");

    expect(storeB.getState().searchQuery).toBe("");
    expect(storeB.getState().activeSentiment).toBe("All");
  });

  it("notifies subscribers when state changes", () => {
    const store = createFeedbackStore();
    let calls = 0;
    const unsubscribe = store.subscribe(() => {
      calls++;
    });

    store.getState().setSearchQuery("a");
    store.getState().setActiveSentiment("Neutral");

    expect(calls).toBe(2);
    unsubscribe();
  });
});

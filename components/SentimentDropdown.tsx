"use client";

import { ChevronDown } from "lucide-react";
import { useFeedbackStore } from "@/store/FeedbackStoreProvider";
import type { SentimentFilter } from "@/store/feedbackStore";

const OPTIONS: { value: SentimentFilter; label: string }[] = [
  { value: "All", label: "All Feedback" },
  { value: "Positive", label: "Positive" },
  { value: "Neutral", label: "Neutral" },
  { value: "Negative", label: "Negative" },
];

export function SentimentDropdown() {
  const activeSentiment = useFeedbackStore((s) => s.activeSentiment);
  const setActiveSentiment = useFeedbackStore((s) => s.setActiveSentiment);

  return (
    <div className="relative">
      <select
        value={activeSentiment}
        onChange={(e) =>
          setActiveSentiment(e.target.value as SentimentFilter)
        }
        aria-label="Filter by sentiment"
        className="w-48 appearance-none text-sm border border-neutral-200 rounded-xl px-3 py-2.5 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900/8 cursor-pointer pr-8"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        size={14}
      />
    </div>
  );
}

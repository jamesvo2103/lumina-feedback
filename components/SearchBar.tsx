"use client";

import { Search } from "lucide-react";
import { useFeedbackStore } from "@/store/FeedbackStoreProvider";

export function SearchBar() {
  const searchQuery = useFeedbackStore((s) => s.searchQuery);
  const setSearchQuery = useFeedbackStore((s) => s.setSearchQuery);

  return (
    <div className="relative flex-1">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        size={16}
      />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name or feedback..."
        aria-label="Search feedback"
        className="w-full bg-white border border-neutral-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/8 focus:border-neutral-300"
      />
    </div>
  );
}

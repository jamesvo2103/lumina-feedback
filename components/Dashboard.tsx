"use client";

import { feedback } from "@/data/feedback";
import { useFeedbackStore } from "@/store/FeedbackStoreProvider";
import { FeedbackCard } from "./FeedbackCard";
import { SearchBar } from "./SearchBar";
import { SentimentDropdown } from "./SentimentDropdown";
import { SentimentChart } from "./SentimentChart";
import { EmptyState } from "./EmptyState";

export function Dashboard() {
  const searchQuery = useFeedbackStore((s) => s.searchQuery);
  const activeSentiment = useFeedbackStore((s) => s.activeSentiment);

  const filtered = feedback
    .filter(
      (f) => activeSentiment === "All" || f.sentiment === activeSentiment,
    )
    .filter((f) => {
      const q = searchQuery.toLowerCase();
      return (
        f.customer_name.toLowerCase().includes(q) ||
        f.feedback_text.toLowerCase().includes(q)
      );
    });

  const totalCount = feedback.length;
  const positiveCount = feedback.filter((f) => f.sentiment === "Positive").length;
  const negativeCount = feedback.filter((f) => f.sentiment === "Negative").length;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            Lumina
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Customer Feedback</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <StatPill label="Total" value={totalCount} />
          <StatPill label="Positive" value={positiveCount} accent="positive" />
          <StatPill label="Negative" value={negativeCount} accent="negative" />
        </div>
      </header>

      <SentimentChart />

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar />
        <SentimentDropdown />
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <FeedbackCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}

function StatPill({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "positive" | "negative";
}) {
  const valueClass =
    accent === "positive"
      ? "text-emerald-700"
      : accent === "negative"
        ? "text-red-600"
        : "text-neutral-900";
  return (
    <div className="inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-full px-3 py-1.5">
      <span className="text-xs text-neutral-400">{label}</span>
      <span className={`text-xs font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}

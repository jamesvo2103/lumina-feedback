"use client";

import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { ChevronDown } from "lucide-react";
import { feedback } from "@/data/feedback";
import { groupFeedbackByTimeBucket, type TimeBucket } from "@/lib/utils";
import type { Sentiment } from "@/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const SENTIMENTS: Sentiment[] = ["Positive", "Neutral", "Negative"];
const BUCKETS: TimeBucket[] = ["Day", "Week", "Month", "Year"];

const SENTIMENT_COLOR: Record<Sentiment, string> = {
  Positive: "#10b981",
  Neutral: "#94a3b8",
  Negative: "#f87171",
};

const SENTIMENT_HOVER: Record<Sentiment, string> = {
  Positive: "#059669",
  Neutral: "#64748b",
  Negative: "#ef4444",
};

const TOTAL_BY_SENTIMENT: Record<Sentiment, number> = feedback.reduce(
  (acc, item) => {
    acc[item.sentiment]++;
    return acc;
  },
  { Positive: 0, Neutral: 0, Negative: 0 } as Record<Sentiment, number>,
);

export function SentimentChart() {
  const [sentiment, setSentiment] = useState<Sentiment>("Positive");
  const [bucket, setBucket] = useState<TimeBucket>("Day");

  const total = TOTAL_BY_SENTIMENT[sentiment];

  const { data, options } = useMemo(() => {
    const grouped = groupFeedbackByTimeBucket(feedback, bucket);
    const counts = grouped.map((g) => g[sentiment]);

    const chartData = {
      labels: grouped.map((g) => g.label),
      datasets: [
        {
          label: sentiment,
          data: counts,
          backgroundColor: SENTIMENT_COLOR[sentiment],
          hoverBackgroundColor: SENTIMENT_HOVER[sentiment],
          borderRadius: 6,
          borderSkipped: false as const,
          borderWidth: 0,
          maxBarThickness: 36,
          categoryPercentage: 0.7,
          barPercentage: 0.7,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#171717",
          titleFont: { size: 12, weight: 600 as const },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            title: (items: TooltipItem<"bar">[]) => items[0]?.label ?? "",
            label: (item: TooltipItem<"bar">) =>
              `${item.parsed.y ?? 0} ${sentiment.toLowerCase()}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { font: { size: 11 }, color: "#a3a3a3" },
        },
        y: {
          beginAtZero: true,
          border: { display: false },
          grid: { color: "#f5f5f5", drawTicks: false },
          ticks: {
            stepSize: 1,
            precision: 0,
            font: { size: 11 },
            color: "#a3a3a3",
            padding: 8,
          },
        },
      },
    };

    return { data: chartData, options: chartOptions };
  }, [sentiment, bucket]);

  return (
    <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900 tracking-tight">
            Feedback Trends
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            <span
              className="font-semibold text-neutral-900"
              style={{ color: SENTIMENT_COLOR[sentiment] }}
            >
              {total}
            </span>{" "}
            {sentiment.toLowerCase()} {total === 1 ? "response" : "responses"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-400">Group by</span>
          <div className="relative">
            <select
              value={bucket}
              onChange={(e) => setBucket(e.target.value as TimeBucket)}
              aria-label="Group by time bucket"
              className="appearance-none text-xs font-medium border border-neutral-200 rounded-lg pl-3 pr-7 py-1.5 bg-white text-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-900/8 cursor-pointer"
            >
              {BUCKETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
            />
          </div>
        </div>
      </header>

      <div
        role="tablist"
        aria-label="Select sentiment"
        className="mt-5 inline-flex rounded-lg border border-neutral-200 bg-neutral-100 p-0.5"
      >
        {SENTIMENTS.map((s) => {
          const active = s === sentiment;
          return (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSentiment(s)}
              className={
                active
                  ? "px-3 py-1 text-xs font-medium rounded-md bg-white text-neutral-900 shadow-sm"
                  : "px-3 py-1 text-xs font-medium rounded-md text-neutral-500 hover:text-neutral-900 transition-colors"
              }
            >
              {s}
            </button>
          );
        })}
      </div>

      <div className="mt-5 h-64">
        <Bar data={data} options={options} />
      </div>
    </section>
  );
}

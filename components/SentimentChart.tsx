"use client";

import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { ChevronDown, Info } from "lucide-react";
import { feedback } from "@/data/feedback";
import { groupFeedbackByTimeBucket, type TimeBucket } from "@/lib/utils";
import type { Sentiment } from "@/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip);

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

const TOTAL_BY_SENTIMENT: Record<Sentiment, number> = {
  Positive: feedback.filter((f) => f.sentiment === "Positive").length,
  Neutral: feedback.filter((f) => f.sentiment === "Neutral").length,
  Negative: feedback.filter((f) => f.sentiment === "Negative").length,
};

const TOOLTIP_TEXT =
  "Shows the number of feedback responses for the selected sentiment over time. " +
  "Use the sentiment toggle and time grouping control to change the view.";

export function SentimentChart() {
  const [sentiment, setSentiment] = useState<Sentiment>("Positive");
  const [bucket, setBucket] = useState<TimeBucket>("Day");
  const [infoVisible, setInfoVisible] = useState(false);

  const total = TOTAL_BY_SENTIMENT[sentiment];

  const { data, options } = useMemo(() => {
    const grouped = groupFeedbackByTimeBucket(feedback, bucket);

    const chartData = {
      labels: grouped.map((g) => g.label),
      datasets: [
        {
          label: sentiment,
          data: grouped.map((g) => g[sentiment]),
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
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-semibold text-neutral-900 tracking-tight">
              Feedback Trends
            </h2>
            <div className="relative flex items-center">
              <button
                type="button"
                aria-label="Explain feedback trends chart"
                onMouseEnter={() => setInfoVisible(true)}
                onMouseLeave={() => setInfoVisible(false)}
                onFocus={() => setInfoVisible(true)}
                onBlur={() => setInfoVisible(false)}
                className="flex items-center justify-center text-neutral-400 hover:text-neutral-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 rounded-full transition-colors"
              >
                <Info size={13} />
              </button>
              {infoVisible && (
                <div
                  role="tooltip"
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 rounded-lg border border-neutral-200 bg-white px-3 py-2.5 shadow-md text-xs text-neutral-600 leading-relaxed z-10 pointer-events-none"
                >
                  {TOOLTIP_TEXT}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-2 h-2 -mt-1 rotate-45 bg-white border-r border-b border-neutral-200" />
                </div>
              )}
            </div>
          </div>
          <p className="mt-1 text-xs text-neutral-400">
            <span style={{ color: SENTIMENT_COLOR[sentiment] }} className="font-semibold">
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
        {SENTIMENTS.map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={s === sentiment}
            onClick={() => setSentiment(s)}
            className={
              s === sentiment
                ? "px-3 py-1 text-xs font-medium rounded-md bg-white text-neutral-900 shadow-sm"
                : "px-3 py-1 text-xs font-medium rounded-md text-neutral-500 hover:text-neutral-900 transition-colors"
            }
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-5 h-64">
        <Bar key={`${sentiment}-${bucket}`} data={data} options={options} />
      </div>
    </section>
  );
}

"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { feedback } from "@/data/feedback";
import { groupByDateAndSentiment } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);

const grouped = groupByDateAndSentiment(feedback);

const data = {
  labels: grouped.map((g) => g.date),
  datasets: [
    {
      label: "Positive",
      data: grouped.map((g) => g.Positive),
      borderColor: "#10b981",
      backgroundColor: "rgba(16,185,129,0.08)",
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: "#10b981",
      borderWidth: 2,
    },
    {
      label: "Negative",
      data: grouped.map((g) => g.Negative),
      borderColor: "#f87171",
      backgroundColor: "rgba(248,113,113,0.08)",
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: "#f87171",
      borderWidth: 2,
    },
    {
      label: "Neutral",
      data: grouped.map((g) => g.Neutral),
      borderColor: "#94a3b8",
      backgroundColor: "rgba(148,163,184,0.08)",
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: "#94a3b8",
      borderWidth: 2,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: { boxWidth: 10, font: { size: 12 }, color: "#525252" },
    },
    tooltip: { mode: "index" as const, intersect: false },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 }, color: "#a3a3a3" },
    },
    y: {
      beginAtZero: true,
      grid: { color: "#f3f4f6" },
      ticks: { stepSize: 1, font: { size: 11 }, color: "#a3a3a3" },
    },
  },
};

export function SentimentChart() {
  return (
    <section className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-neutral-900 mb-4 tracking-tight">
        Feedback Trends
      </h2>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}

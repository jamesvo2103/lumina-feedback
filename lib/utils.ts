import { FeedbackItem, Sentiment } from "@/types";

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export interface GroupedSentiment {
  date: string;
  Positive: number;
  Neutral: number;
  Negative: number;
}

export function groupByDateAndSentiment(
  items: FeedbackItem[],
): GroupedSentiment[] {
  const map: Record<string, Record<Sentiment, number>> = {};
  for (const item of items) {
    if (!map[item.date]) {
      map[item.date] = { Positive: 0, Neutral: 0, Negative: 0 };
    }
    map[item.date][item.sentiment]++;
  }
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, counts]) => ({ date, ...counts }));
}

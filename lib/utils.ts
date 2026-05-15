import { FeedbackItem, Sentiment } from "@/types";

export type TimeBucket = "Day" | "Week" | "Month" | "Year";

export interface BucketedSentiment {
  label: string;
  Positive: number;
  Neutral: number;
  Negative: number;
}

export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isoWeek(d: Date): { year: number; week: number; monday: Date } {
  const thursday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayOfWeek = thursday.getDay() || 7;
  thursday.setDate(thursday.getDate() + 4 - dayOfWeek);

  const isoYear = thursday.getFullYear();
  const yearStart = new Date(isoYear, 0, 1);
  const week = Math.ceil(
    ((thursday.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  );

  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  monday.setDate(monday.getDate() - (dayOfWeek - 1));

  return { year: isoYear, week, monday };
}

function bucketFor(
  dateStr: string,
  bucket: TimeBucket,
): { key: string; label: string } {
  const d = parseLocalDate(dateStr);

  if (bucket === "Day") {
    return {
      key: dateStr,
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  }

  if (bucket === "Week") {
    const { year, week, monday } = isoWeek(d);
    const weekLabel = monday.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return {
      key: `${year}-W${String(week).padStart(2, "0")}`,
      label: `Week of ${weekLabel}`,
    };
  }

  if (bucket === "Month") {
    const year = d.getFullYear();
    const month = d.getMonth();
    return {
      key: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  }

  const year = d.getFullYear();
  return { key: String(year), label: String(year) };
}

export function groupFeedbackByTimeBucket(
  items: FeedbackItem[],
  bucket: TimeBucket,
): BucketedSentiment[] {
  const map = new Map<
    string,
    { label: string; counts: Record<Sentiment, number> }
  >();

  for (const item of items) {
    const { key, label } = bucketFor(item.date, bucket);
    const existing = map.get(key);
    if (existing) {
      existing.counts[item.sentiment]++;
    } else {
      const counts: Record<Sentiment, number> = {
        Positive: 0,
        Neutral: 0,
        Negative: 0,
      };
      counts[item.sentiment] = 1;
      map.set(key, { label, counts });
    }
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, { label, counts }]) => ({ label, ...counts }));
}

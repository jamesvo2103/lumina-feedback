import { describe, it, expect } from "vitest";
import {
  parseLocalDate,
  formatDate,
  groupFeedbackByTimeBucket,
} from "@/lib/utils";
import type { FeedbackItem } from "@/types";

describe("parseLocalDate", () => {
  it("parses YYYY-MM-DD as a local-time Date with no timezone shift", () => {
    const d = parseLocalDate("2026-05-10");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(4);
    expect(d.getDate()).toBe(10);
    expect(d.getHours()).toBe(0);
  });

  it("handles single-digit months and days", () => {
    const d = parseLocalDate("2024-01-05");
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(0);
    expect(d.getDate()).toBe(5);
  });
});

describe("formatDate", () => {
  it("formats a date string as 'Mon D, YYYY'", () => {
    expect(formatDate("2026-05-10")).toBe("May 10, 2026");
  });

  it("formats the first of a month without a leading zero", () => {
    expect(formatDate("2026-01-01")).toBe("Jan 1, 2026");
  });

  it("never shifts the day across timezones (regression)", () => {
    expect(formatDate("2026-05-10")).not.toBe("May 9, 2026");
  });
});

const SAMPLE: FeedbackItem[] = [
  { id: 1, customer_name: "Alice M.", feedback_text: "", sentiment: "Positive", date: "2026-05-10" },
  { id: 2, customer_name: "James B.", feedback_text: "", sentiment: "Negative", date: "2026-05-11" },
  { id: 3, customer_name: "Sarah L.", feedback_text: "", sentiment: "Neutral", date: "2026-05-12" },
  { id: 4, customer_name: "David K.", feedback_text: "", sentiment: "Positive", date: "2026-05-12" },
  { id: 5, customer_name: "Emma W.", feedback_text: "", sentiment: "Negative", date: "2026-05-13" },
  { id: 6, customer_name: "Tom H.", feedback_text: "", sentiment: "Neutral", date: "2026-05-14" },
];

describe("groupFeedbackByTimeBucket", () => {
  it("returns an empty array for an empty input", () => {
    expect(groupFeedbackByTimeBucket([], "Day")).toEqual([]);
  });

  describe('bucket: "Day"', () => {
    const grouped = groupFeedbackByTimeBucket(SAMPLE, "Day");

    it("produces one bucket per distinct date", () => {
      expect(grouped).toHaveLength(5);
    });

    it("counts the first item in a new bucket (regression for first-item-not-counted bug)", () => {
      const may10 = grouped.find((g) => g.label === "May 10");
      expect(may10).toEqual({ label: "May 10", Positive: 1, Neutral: 0, Negative: 0 });
    });

    it("aggregates multiple items in the same bucket", () => {
      const may12 = grouped.find((g) => g.label === "May 12");
      expect(may12).toEqual({ label: "May 12", Positive: 1, Neutral: 1, Negative: 0 });
    });

    it("counts every sentiment correctly across all buckets", () => {
      const totals = grouped.reduce(
        (acc, g) => {
          acc.Positive += g.Positive;
          acc.Neutral += g.Neutral;
          acc.Negative += g.Negative;
          return acc;
        },
        { Positive: 0, Neutral: 0, Negative: 0 },
      );
      expect(totals).toEqual({ Positive: 2, Neutral: 2, Negative: 2 });
    });

    it("returns buckets sorted ascending by date", () => {
      const labels = grouped.map((g) => g.label);
      expect(labels).toEqual(["May 10", "May 11", "May 12", "May 13", "May 14"]);
    });
  });

  describe('bucket: "Week"', () => {
    const grouped = groupFeedbackByTimeBucket(SAMPLE, "Week");

    it("groups Sunday into the previous Monday-starting week", () => {
      // May 10, 2026 is a Sunday — ISO week 19, Monday = May 4
      const w19 = grouped.find((g) => g.label === "Week of May 4");
      expect(w19).toBeDefined();
      expect(w19?.Positive).toBe(1);
    });

    it("groups Mon–Sun together starting with the following Monday", () => {
      // May 11 (Mon) through May 14 (Thu) — ISO week 20, Monday = May 11
      const w20 = grouped.find((g) => g.label === "Week of May 11");
      expect(w20).toEqual({
        label: "Week of May 11",
        Positive: 1,
        Neutral: 2,
        Negative: 2,
      });
    });

    it("produces exactly two weekly buckets for the sample dataset", () => {
      expect(grouped).toHaveLength(2);
    });
  });

  describe('bucket: "Month"', () => {
    const grouped = groupFeedbackByTimeBucket(SAMPLE, "Month");

    it("collapses every item into a single month", () => {
      expect(grouped).toHaveLength(1);
      expect(grouped[0]).toEqual({
        label: "May 2026",
        Positive: 2,
        Neutral: 2,
        Negative: 2,
      });
    });

    it("separates items across different months", () => {
      const multiMonth: FeedbackItem[] = [
        { id: 1, customer_name: "A", feedback_text: "", sentiment: "Positive", date: "2026-04-30" },
        { id: 2, customer_name: "B", feedback_text: "", sentiment: "Positive", date: "2026-05-01" },
      ];
      const result = groupFeedbackByTimeBucket(multiMonth, "Month");
      expect(result).toHaveLength(2);
      expect(result[0].label).toBe("Apr 2026");
      expect(result[1].label).toBe("May 2026");
    });
  });

  describe('bucket: "Year"', () => {
    it("collapses every item into a single year", () => {
      const grouped = groupFeedbackByTimeBucket(SAMPLE, "Year");
      expect(grouped).toEqual([
        { label: "2026", Positive: 2, Neutral: 2, Negative: 2 },
      ]);
    });

    it("separates items across different years", () => {
      const items: FeedbackItem[] = [
        { id: 1, customer_name: "A", feedback_text: "", sentiment: "Positive", date: "2025-12-31" },
        { id: 2, customer_name: "B", feedback_text: "", sentiment: "Negative", date: "2026-01-01" },
      ];
      const result = groupFeedbackByTimeBucket(items, "Year");
      expect(result.map((r) => r.label)).toEqual(["2025", "2026"]);
    });
  });
});

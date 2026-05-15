export type Sentiment = "Positive" | "Neutral" | "Negative";

export interface FeedbackItem {
  id: number;
  customer_name: string;
  feedback_text: string;
  sentiment: Sentiment;
  date: string;
}

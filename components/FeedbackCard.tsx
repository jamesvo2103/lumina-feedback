import { FeedbackItem, Sentiment } from "@/types";
import { formatDate } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const SENTIMENT_BADGE: Record<Sentiment, string> = {
  Positive: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Neutral: "bg-neutral-100 text-neutral-500 border border-neutral-200",
  Negative: "bg-red-50 text-red-600 border border-red-200",
};

export function FeedbackCard({ item }: { item: FeedbackItem }) {
  return (
    <article className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-px">
      <header className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-neutral-100 text-neutral-500 text-xs font-semibold flex items-center justify-center flex-shrink-0">
          {getInitials(item.customer_name)}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-sm text-neutral-900 truncate">
              {item.customer_name}
            </span>
            <span className="text-xs text-neutral-400 flex-shrink-0">
              {formatDate(item.date)}
            </span>
          </div>
          <span
            className={`mt-1.5 inline-flex self-start items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${SENTIMENT_BADGE[item.sentiment]}`}
          >
            {item.sentiment}
          </span>
        </div>
      </header>
      <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
        {item.feedback_text}
      </p>
    </article>
  );
}

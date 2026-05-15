
import { MessageSquareOff } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <MessageSquareOff size={36} className="text-neutral-300" />
      <p className="text-neutral-500 font-medium text-sm mt-3">
        No feedback found
      </p>
      <p className="text-neutral-400 text-xs mt-1">
        Try a different search or filter.
      </p>
    </div>
  );
}

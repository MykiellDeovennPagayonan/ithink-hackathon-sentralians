import { formatDistanceToNow } from "date-fns";

export function formatRelativeDate(timestamp: Date): string {
  return formatDistanceToNow(new Date(Number(timestamp)), { addSuffix: true });
}

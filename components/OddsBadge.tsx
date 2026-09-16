import { formatOdds } from "@/lib/formatting";

export function OddsBadge({
  value,
  size = "lg",
}: {
  value: number;
  size?: "lg" | "md";
}) {
  return (
    <span
      className={
        "font-mono font-semibold text-accent " + (size === "lg" ? "text-[22px]" : "text-lg")
      }
    >
      {formatOdds(value)}
    </span>
  );
}

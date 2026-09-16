import { formatOdds } from "@/lib/formatting";
import type { SlipSelection } from "@/lib/types";
import { StatusPill } from "./StatusPill";

export function SelectionRow({ selection }: { selection: SlipSelection }) {
  const isRemoved = selection.status === "removed";

  return (
    <div
      className={
        "flex items-center gap-3.5 border-t border-border-subtle px-5 py-3.5 " +
        (isRemoved ? "opacity-55" : "opacity-100")
      }
    >
      <div className="min-w-0 flex-1 flex flex-col gap-0.5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-text-primary">{selection.outcomeName}</span>
          <span className="text-xs text-text-tertiary">{selection.marketName}</span>
        </div>
        <div className="truncate text-[12.5px] text-text-secondary">
          {selection.eventName} &middot; {selection.kickoffLabel}
        </div>
      </div>
      <StatusPill variant={selection.status} />
      <span className="min-w-[44px] text-right font-mono text-[15px] font-semibold text-text-primary">
        {formatOdds(selection.priceDecimal)}
      </span>
    </div>
  );
}

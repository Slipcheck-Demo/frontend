import type { SlipSelection } from "@/lib/types";
import { OddsBadge } from "./OddsBadge";
import { SelectionRow } from "./SelectionRow";

export function SlipCard({
  bookingCode,
  selections,
  totalOdds,
  showTotal = true,
  title,
}: {
  bookingCode: string;
  selections: SlipSelection[];
  totalOdds?: number;
  showTotal?: boolean;
  title?: string;
}) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-surface-raised">
      {title ? (
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-3.5">
          <span className="text-[13px] font-semibold uppercase tracking-wide text-text-secondary">
            {title}
          </span>
          <span className="font-mono text-xs text-text-tertiary">
            {selections.length} legs
          </span>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-[18px]">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
            Booking code
          </span>
          <span className="font-mono text-lg font-semibold tracking-wide text-text-primary">
            {bookingCode}
          </span>
        </div>
        {showTotal && totalOdds != null ? (
          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
              Total odds
            </span>
            <OddsBadge value={totalOdds} size="lg" />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col">
        {selections.map((selection) => (
          <SelectionRow key={selection.outcomeId} selection={selection} />
        ))}
      </div>
    </div>
  );
}

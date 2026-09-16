export interface BuilderItem {
  outcomeId: string;
  outcomeName: string;
  eventShort: string;
  eventId: number;
  priceDecimal?: number;
}

export function SlipBuilder({
  items,
  onRemove,
  onGenerate,
  generating,
}: {
  items: BuilderItem[];
  onRemove: (outcomeId: string) => void;
  onGenerate: () => void;
  generating: boolean;
}) {
  // Only show a total once every leg's price is known — multiplying just the known subset
  // would silently understate the real total odds for a slip that includes a leg whose price
  // hasn't loaded/isn't live (e.g. a suspended market), with nothing on screen to flag that.
  const knownPrices = items
    .map((item) => item.priceDecimal)
    .filter((price): price is number => price != null);
  const total =
    items.length > 0 && knownPrices.length === items.length
      ? knownPrices.reduce((a, b) => a * b, 1)
      : null;

  return (
    <div className="flex w-[340px] shrink-0 flex-col gap-[18px] border-l border-border-subtle bg-surface-sunken px-6 py-7">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-text-secondary">
          Your slip
        </span>
        <span className="font-mono text-xs text-text-tertiary">{items.length} legs</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {items.length === 0 ? (
          <p className="text-xs text-text-tertiary">Pick an outcome to start building a slip.</p>
        ) : null}
        {items.map((item) => (
          <div
            key={item.outcomeId}
            className="flex items-start justify-between gap-2.5 rounded-md border border-border bg-surface-raised px-3.5 py-3"
          >
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-text-primary">
                {item.outcomeName}
              </span>
              <span className="truncate text-xs text-text-secondary">{item.eventShort}</span>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.outcomeId)}
              aria-label={`Remove ${item.outcomeName}`}
              className="shrink-0 text-text-tertiary hover:text-danger"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="h-px bg-border-subtle" />

      <div className="flex items-center justify-between">
        <span className="text-[13px] text-text-secondary">Total odds</span>
        <span className="font-mono text-lg font-semibold text-accent">
          {total != null ? total.toFixed(2) : "—"}
        </span>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={items.length === 0 || generating}
        className="rounded-md bg-accent py-[13px] text-sm font-semibold text-on-accent disabled:opacity-50"
      >
        {generating ? "Generating…" : "Generate code"}
      </button>
    </div>
  );
}

export function SlipCardSkeleton() {
  return (
    <div className="flex flex-col gap-3.5 rounded-lg border border-border bg-surface-raised p-5">
      <div className="skeleton h-5 w-2/5" />
      <div className="skeleton h-[52px] w-full" />
      <div className="skeleton h-[52px] w-full" />
      <div className="skeleton h-[52px] w-full" />
    </div>
  );
}

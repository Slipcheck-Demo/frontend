export function StatusPill({ variant }: { variant: "active" | "removed" }) {
  const isActive = variant === "active";
  return (
    <span
      className={
        "whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-semibold " +
        (isActive ? "bg-success/14 text-success" : "bg-danger/14 text-danger")
      }
    >
      {isActive ? "Active" : "Removed"}
    </span>
  );
}

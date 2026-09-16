export function formatOdds(value: number): string {
  return value.toFixed(2);
}

export function formatKickoff(epochSeconds: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(epochSeconds * 1000));
}

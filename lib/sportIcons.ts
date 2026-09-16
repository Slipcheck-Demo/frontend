// Emoji per Betway sportId (see docs/betway-api.md §"sports") — a quick semantic stand-in
// for real icon assets, which we don't have. Falls back to a generic medal for anything new.
const SPORT_ICONS: Record<string, string> = {
  soccer: "⚽",
  tennis: "🎾",
  basketball: "🏀",
  cricket: "🏏",
  "rugby-union": "🏉",
  "american-football": "🏈",
  boxing: "🥊",
  "table-tennis": "🏓",
  volleyball: "🏐",
  golf: "⛳",
  "formula-1": "🏎️",
  "aussie-rules": "🏟️",
  handball: "🤾",
  "ice-hockey": "🏒",
  baseball: "⚾",
  darts: "🎯",
  speedway: "🏍️",
  "water-polo": "🤽",
  cycling: "🚴",
  badminton: "🏸",
  futsal: "🥅",
  snooker: "🎱",
  lacrosse: "🥍",
  pesapallo: "🥎",
  floorball: "🏑",
};

export function sportIcon(sportId: string): string {
  return SPORT_ICONS[sportId] ?? "🏅";
}

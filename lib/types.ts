// UI-facing selection shape used by SlipCard/SelectionRow. Pages map the backend's raw
// response (see docs/betway-api.md) into this shape — presentation components never know
// about `isBettable`/`eventEpoch` directly.
export interface SlipSelection {
  outcomeId: string;
  marketName: string;
  outcomeName: string;
  eventName: string;
  kickoffLabel: string;
  priceDecimal: number;
  status: "active" | "removed";
}

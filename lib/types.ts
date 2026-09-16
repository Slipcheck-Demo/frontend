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

// Backend response shapes — see stellar-test-task/backend/src/routes/*.ts. Keep these
// exactly mirroring the backend's own response bodies, not a convenience shape.

export interface RawSelection {
  outcomeId: string;
  marketId: string;
  marketName: string;
  outcomeName: string;
  eventId: number;
  eventName: string;
  eventEpoch: number;
  priceDecimal: number;
  isBettable: boolean;
}

export interface SlipResponse {
  bookingCode: string;
  selections: RawSelection[];
  totalOdds: number;
}

export interface ConvertResponse {
  bookingCode: string;
  selections: RawSelection[];
  removedLegs: RawSelection[];
  totalOdds: number;
}

export type ApiErrorCode =
  | "invalid_code"
  | "conflicting_selections"
  | "validation_error"
  | "upstream_error"
  | "internal_error";

export interface Sport {
  sportId: string;
  name: string;
  sportType: "Sport" | "Promo";
}

export interface EventOutcome {
  outcomeId: string;
  displayName: string;
  index: number;
  priceDecimal?: number;
}

export interface EventMarket {
  marketId: string;
  displayName: string;
  outcomes: EventOutcome[];
}

export interface EventSummary {
  eventId: number;
  name: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  region: string;
  expectedStartEpoch: number;
  isLive: boolean;
  markets: EventMarket[];
}

export interface EventsResponse {
  events: EventSummary[];
  isFinalPage: boolean;
}

export interface EventMarketsResponse {
  markets: EventMarket[];
}

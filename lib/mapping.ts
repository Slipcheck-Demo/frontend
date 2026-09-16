import { formatKickoff } from "./formatting";
import type { RawSelection, SlipSelection } from "./types";

export function toSlipSelection(raw: RawSelection): SlipSelection {
  return {
    outcomeId: raw.outcomeId,
    marketName: raw.marketName,
    outcomeName: raw.outcomeName,
    eventName: raw.eventName,
    kickoffLabel: formatKickoff(raw.eventEpoch),
    priceDecimal: raw.priceDecimal,
    status: raw.isBettable ? "active" : "removed",
  };
}

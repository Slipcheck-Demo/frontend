import { ErrorBanner } from "@/components/ErrorBanner";
import { SlipCard } from "@/components/SlipCard";
import { SlipCardSkeleton } from "@/components/SlipCardSkeleton";
import type { SlipSelection } from "@/lib/types";

const sampleSelections: SlipSelection[] = [
  {
    outcomeId: "7469919811",
    marketName: "1X2",
    outcomeName: "Arsenal FC (Vangogh)",
    eventName: "Arsenal FC (Vangogh) vs. Chelsea FC (Nathan)",
    kickoffLabel: "Today 20:30",
    priceDecimal: 2.29,
    status: "active",
  },
  {
    outcomeId: "999",
    marketName: "1X2",
    outcomeName: "Draw",
    eventName: "Bayern Munich vs. Borussia Dortmund",
    kickoffLabel: "Sep 14, 18:00",
    priceDecimal: 3.4,
    status: "removed",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-1 flex-col gap-7 p-8">
      <h1 className="text-2xl font-bold text-text-primary">Component check</h1>
      <SlipCard bookingCode="BW72B51F99" selections={sampleSelections} totalOdds={7.79} />
      <SlipCardSkeleton />
      <ErrorBanner message="We couldn't find a usable slip for that code. It may be wrong, expired, or have no selections left on it — double-check it and try again." />
    </main>
  );
}

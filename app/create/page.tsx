import { CenteredScreen } from "@/components/CenteredScreen";
import { SlipCard } from "@/components/SlipCard";
import type { SlipSelection } from "@/lib/types";

const selections: SlipSelection[] = [
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
    outcomeId: "7469919818total=2.5~12",
    marketName: "Total (2.5)",
    outcomeName: "Over",
    eventName: "Arsenal FC (Vangogh) vs. Chelsea FC (Nathan)",
    kickoffLabel: "Today 20:30",
    priceDecimal: 1.85,
    status: "active",
  },
];

export default function CreatePage() {
  return (
    <CenteredScreen>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-success/14">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 13l4 4L19 7"
              stroke="#34D399"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-text-primary">Your code is ready</h1>
          <p className="text-sm text-text-secondary">
            Share it, or copy it into the Betway betslip.
          </p>
        </div>
      </div>

      <SlipCard bookingCode="BW72B51F99" selections={selections} totalOdds={4.24} />
    </CenteredScreen>
  );
}

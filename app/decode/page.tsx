"use client";

import { useState } from "react";
import { CenteredScreen } from "@/components/CenteredScreen";
import { CodeInputForm } from "@/components/CodeInputForm";
import { SlipCard } from "@/components/SlipCard";
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
    outcomeId: "7423294012",
    marketName: "Total (2.5)",
    outcomeName: "Over",
    eventName: "Real Madrid vs. Liverpool FC",
    kickoffLabel: "Tomorrow 19:00",
    priceDecimal: 1.85,
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

export default function DecodePage() {
  const [code, setCode] = useState("BW72B51F99");

  return (
    <CenteredScreen>
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold tracking-tight text-text-primary">
          Decode a booking code
        </h1>
        <p className="text-[14.5px] leading-relaxed text-text-secondary">
          Paste a code to see every selection on the slip, its live odds, and whether each leg
          can still be bet.
        </p>
      </div>

      <CodeInputForm
        value={code}
        onChange={setCode}
        onSubmit={() => {}}
        placeholder="e.g. BW72B51F99"
        submitLabel="Decode"
      />

      <SlipCard bookingCode={code} selections={sampleSelections} totalOdds={14.4} />
    </CenteredScreen>
  );
}

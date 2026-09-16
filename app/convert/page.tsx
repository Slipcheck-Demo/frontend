"use client";

import { useState } from "react";
import { CenteredScreen } from "@/components/CenteredScreen";
import { CodeInputForm } from "@/components/CodeInputForm";
import { SlipCard } from "@/components/SlipCard";
import type { SlipSelection } from "@/lib/types";

const keptSelections: SlipSelection[] = [
  {
    outcomeId: "7469919811",
    marketName: "1X2",
    outcomeName: "Arsenal FC (Vangogh)",
    eventName: "Arsenal FC (Vangogh) vs. Chelsea FC (Nathan)",
    kickoffLabel: "Today 20:30",
    priceDecimal: 2.29,
    status: "active",
  },
];

const removedSelections: SlipSelection[] = [
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

export default function ConvertPage() {
  const [code, setCode] = useState("BW6E19810C");

  return (
    <CenteredScreen>
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold tracking-tight text-text-primary">
          Convert a booking code
        </h1>
        <p className="text-[14.5px] leading-relaxed text-text-secondary">
          Drops any selection that&rsquo;s expired or suspended and generates a fresh code
          with what&rsquo;s left.
        </p>
      </div>

      <CodeInputForm
        value={code}
        onChange={setCode}
        onSubmit={() => {}}
        placeholder="e.g. BW6E19810C"
        submitLabel="Convert"
      />

      <div className="flex flex-col gap-4">
        <SlipCard bookingCode="BW72B51FA3" selections={keptSelections} totalOdds={2.29} title="Kept" />
        <SlipCard bookingCode={code} selections={removedSelections} showTotal={false} title="Removed" />
      </div>
    </CenteredScreen>
  );
}

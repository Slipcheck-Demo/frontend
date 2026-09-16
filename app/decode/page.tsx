"use client";

import { ApiError, resolveCode } from "@/lib/api";
import { CodeActionScreen } from "@/components/CodeActionScreen";
import { SlipCard } from "@/components/SlipCard";
import { useCodeAction } from "@/lib/hooks/useCodeAction";
import { toSlipSelection } from "@/lib/mapping";
import type { SlipResponse } from "@/lib/types";

function errorMessageFor(err: ApiError): string {
  if (err.code === "invalid_code") {
    return "We couldn't find a usable slip for that code. It may be wrong, expired, or have no selections left on it — double-check it and try again.";
  }
  return "Something went wrong talking to Betway. Please try again in a moment.";
}

export default function DecodePage() {
  const { code, setCode, status, result, errorMessage, submit } = useCodeAction<SlipResponse>(
    resolveCode,
    errorMessageFor,
  );

  return (
    <CodeActionScreen
      title="Decode a booking code"
      subtitle="Paste a code to see every selection on the slip, its live odds, and whether each leg can still be bet."
      placeholder="e.g. BW72B51F99"
      submitLabel="Decode"
      code={code}
      onCodeChange={setCode}
      onSubmit={submit}
      status={status}
      errorMessage={errorMessage}
    >
      {result ? (
        <SlipCard
          bookingCode={result.bookingCode}
          selections={result.selections.map(toSlipSelection)}
          totalOdds={result.totalOdds}
        />
      ) : null}
    </CodeActionScreen>
  );
}

"use client";

import { ApiError, convertCode } from "@/lib/api";
import { CheckIcon } from "@/components/CheckIcon";
import { CodeActionScreen } from "@/components/CodeActionScreen";
import { SlipCard } from "@/components/SlipCard";
import { useCodeAction } from "@/lib/hooks/useCodeAction";
import { toSlipSelection } from "@/lib/mapping";
import type { ConvertResponse } from "@/lib/types";

function errorMessageFor(err: ApiError): string {
  if (err.code === "invalid_code") {
    return "We couldn't convert that code. It may be wrong or expired, or every selection on it may already be invalid or expired — there's nothing left to carry over.";
  }
  return "Something went wrong talking to Betway. Please try again in a moment.";
}

export default function ConvertPage() {
  const {
    code: inputCode,
    setCode: setInputCode,
    status,
    result,
    errorMessage,
    submit,
  } = useCodeAction<ConvertResponse>(convertCode, errorMessageFor);

  return (
    <CodeActionScreen
      title="Convert a booking code"
      subtitle="Drops any selection that's expired or suspended and generates a fresh code with what's left."
      placeholder="e.g. BW6E19810C"
      submitLabel="Convert"
      code={inputCode}
      onCodeChange={setInputCode}
      onSubmit={submit}
      status={status}
      errorMessage={errorMessage}
    >
      {result ? (
        <div className="flex flex-col gap-4">
          {result.removedLegs.length === 0 ? (
            <div className="flex items-center gap-2.5 rounded-md border border-success/30 bg-success/8 px-4 py-3">
              <CheckIcon />
              <span className="text-[13px] text-text-secondary">
                This code is still fully active — every selection is still bettable, so
                nothing needed to change.
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-md border border-success/30 bg-success/8 px-4 py-3">
              <span className="text-[13px] text-text-secondary">
                New code generated from{" "}
                <span className="font-mono text-[#C5CAD6]">{inputCode.trim()}</span>
              </span>
              <span className="font-mono text-[15px] font-semibold text-success">
                {result.bookingCode}
              </span>
            </div>
          )}
          <SlipCard
            bookingCode={result.bookingCode}
            selections={result.selections.map(toSlipSelection)}
            totalOdds={result.totalOdds}
            title={result.removedLegs.length === 0 ? undefined : "Kept"}
          />
          {result.removedLegs.length > 0 ? (
            <SlipCard
              bookingCode={inputCode.trim()}
              selections={result.removedLegs.map(toSlipSelection)}
              showTotal={false}
              title="Removed"
            />
          ) : null}
        </div>
      ) : null}
    </CodeActionScreen>
  );
}

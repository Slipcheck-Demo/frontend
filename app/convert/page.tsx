"use client";

import { useState } from "react";
import { ApiError, convertCode, toApiError } from "@/lib/api";
import { CenteredScreen } from "@/components/CenteredScreen";
import { CodeInputForm } from "@/components/CodeInputForm";
import { ErrorBanner } from "@/components/ErrorBanner";
import { SlipCard } from "@/components/SlipCard";
import { SlipCardSkeleton } from "@/components/SlipCardSkeleton";
import { toSlipSelection } from "@/lib/mapping";
import type { ConvertResponse } from "@/lib/types";

type Status = "idle" | "loading" | "error" | "success";

function errorMessageFor(err: ApiError): string {
  if (err.code === "invalid_code") {
    return "We couldn't convert that code. It may be wrong or expired, or every selection on it may already be invalid or expired — there's nothing left to carry over.";
  }
  return "Something went wrong talking to Betway. Please try again in a moment.";
}

export default function ConvertPage() {
  const [inputCode, setInputCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ConvertResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit() {
    if (!inputCode.trim()) return;
    setStatus("loading");
    try {
      const data = await convertCode(inputCode.trim());
      setResult(data);
      setStatus("success");
    } catch (err) {
      setErrorMessage(errorMessageFor(toApiError(err)));
      setStatus("error");
    }
  }

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
        value={inputCode}
        onChange={setInputCode}
        onSubmit={handleSubmit}
        placeholder="e.g. BW6E19810C"
        submitLabel="Convert"
        hasError={status === "error"}
        disabled={status === "loading"}
      />

      {status === "error" ? <ErrorBanner message={errorMessage} /> : null}
      {status === "loading" ? <SlipCardSkeleton /> : null}
      {status === "success" && result ? (
        <div className="flex flex-col gap-4">
          {result.removedLegs.length === 0 ? (
            <div className="flex items-center gap-2.5 rounded-md border border-success/30 bg-success/8 px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#34D399"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
    </CenteredScreen>
  );
}

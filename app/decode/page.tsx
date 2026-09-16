"use client";

import { useState } from "react";
import { ApiError, resolveCode, toApiError } from "@/lib/api";
import { CenteredScreen } from "@/components/CenteredScreen";
import { CodeInputForm } from "@/components/CodeInputForm";
import { ErrorBanner } from "@/components/ErrorBanner";
import { SlipCard } from "@/components/SlipCard";
import { SlipCardSkeleton } from "@/components/SlipCardSkeleton";
import { toSlipSelection } from "@/lib/mapping";
import type { SlipResponse } from "@/lib/types";

type Status = "idle" | "loading" | "error" | "success";

function errorMessageFor(err: ApiError): string {
  if (err.code === "invalid_code") {
    return "We couldn't find a usable slip for that code. It may be wrong, expired, or have no selections left on it — double-check it and try again.";
  }
  return "Something went wrong talking to Betway. Please try again in a moment.";
}

export default function DecodePage() {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<SlipResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit() {
    if (!code.trim()) return;
    setStatus("loading");
    try {
      const data = await resolveCode(code.trim());
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
        onSubmit={handleSubmit}
        placeholder="e.g. BW72B51F99"
        submitLabel="Decode"
        hasError={status === "error"}
        disabled={status === "loading"}
      />

      {status === "error" ? <ErrorBanner message={errorMessage} /> : null}
      {status === "loading" ? <SlipCardSkeleton /> : null}
      {status === "success" && result ? (
        <SlipCard
          bookingCode={result.bookingCode}
          selections={result.selections.map(toSlipSelection)}
          totalOdds={result.totalOdds}
        />
      ) : null}
    </CenteredScreen>
  );
}

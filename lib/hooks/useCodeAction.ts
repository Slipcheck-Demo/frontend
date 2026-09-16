"use client";

import { useState } from "react";
import { ApiError, toApiError } from "@/lib/api";

export type CodeActionStatus = "idle" | "loading" | "error" | "success";

// Shared by /decode and /convert: both submit a single booking code to one backend call and
// render the same idle → loading → error/success sequence. The only things that differ
// between them (the call itself, and how to phrase a given ApiError) are passed in.
export function useCodeAction<T>(
  action: (code: string) => Promise<T>,
  errorMessageFor: (err: ApiError) => string,
) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<CodeActionStatus>("idle");
  const [result, setResult] = useState<T | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function submit() {
    if (!code.trim()) return;
    setStatus("loading");
    try {
      const data = await action(code.trim());
      setResult(data);
      setStatus("success");
    } catch (err) {
      setErrorMessage(errorMessageFor(toApiError(err)));
      setStatus("error");
    }
  }

  return { code, setCode, status, result, errorMessage, submit };
}

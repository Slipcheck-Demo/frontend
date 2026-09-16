"use client";

import type { FormEvent } from "react";

export function CodeInputForm({
  value,
  onChange,
  onSubmit,
  placeholder,
  submitLabel,
  hasError = false,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  submitLabel: string;
  hasError?: boolean;
  disabled?: boolean;
}) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!disabled) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2.5">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={
          "min-w-0 flex-1 rounded-md border bg-surface px-4 py-[13px] font-mono text-[15px] text-text-primary outline-none " +
          (hasError ? "border-danger" : "border-border")
        }
      />
      <button
        type="submit"
        disabled={disabled}
        className="whitespace-nowrap rounded-md bg-accent px-[22px] text-sm font-semibold text-on-accent disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  );
}

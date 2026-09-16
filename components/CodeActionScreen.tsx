import type { ReactNode } from "react";
import { CenteredScreen } from "./CenteredScreen";
import { CodeInputForm } from "./CodeInputForm";
import { ErrorBanner } from "./ErrorBanner";
import { SlipCardSkeleton } from "./SlipCardSkeleton";
import type { CodeActionStatus } from "@/lib/hooks/useCodeAction";

// Shared page shell for /decode and /convert: title/subtitle, the code input row, and the
// loading/error states. `children` renders only once status is "success" — each page keeps
// its own success body (they differ: a single SlipCard vs. Convert's kept/removed pair).
export function CodeActionScreen({
  title,
  subtitle,
  placeholder,
  submitLabel,
  code,
  onCodeChange,
  onSubmit,
  status,
  errorMessage,
  children,
}: {
  title: string;
  subtitle: string;
  placeholder: string;
  submitLabel: string;
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  status: CodeActionStatus;
  errorMessage: string;
  children: ReactNode;
}) {
  return (
    <CenteredScreen>
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold tracking-tight text-text-primary">{title}</h1>
        <p className="text-[14.5px] leading-relaxed text-text-secondary">{subtitle}</p>
      </div>

      <CodeInputForm
        value={code}
        onChange={onCodeChange}
        onSubmit={onSubmit}
        placeholder={placeholder}
        submitLabel={submitLabel}
        hasError={status === "error"}
        disabled={status === "loading"}
      />

      {status === "error" ? <ErrorBanner message={errorMessage} /> : null}
      {status === "loading" ? <SlipCardSkeleton /> : null}
      {status === "success" ? children : null}
    </CenteredScreen>
  );
}

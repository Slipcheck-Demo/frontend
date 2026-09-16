export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-danger/35 bg-danger/10 px-4 py-3.5">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="mt-px shrink-0"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="#F76E6E" strokeWidth="2" />
        <path d="M12 8v5" stroke="#F76E6E" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16" r="1" fill="#F76E6E" />
      </svg>
      <div className="text-[13.5px] leading-relaxed text-danger-soft">{message}</div>
    </div>
  );
}

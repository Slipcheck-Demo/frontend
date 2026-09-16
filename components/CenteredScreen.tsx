export function CenteredScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 justify-center px-6 py-16">
      <div className="flex w-full max-w-[640px] flex-col gap-7">{children}</div>
    </div>
  );
}

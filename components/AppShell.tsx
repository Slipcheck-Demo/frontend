"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/decode", label: "Decode" },
  { href: "/create", label: "Create" },
  { href: "/convert", label: "Convert" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between border-b border-border-subtle px-10 py-5">
        <span className="text-lg font-bold tracking-tight text-text-primary">Slipcheck</span>
        <nav className="flex gap-1 rounded-md border border-border bg-surface p-1">
          {TABS.map((tab) => {
            const active = pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={
                  "rounded-sm px-4 py-1.5 text-[13px] font-semibold " +
                  (active ? "bg-accent text-on-accent" : "text-text-secondary")
                }
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}

import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export function ScreenHeader({
  title,
  subtitle,
  back = "/home",
  right,
}: {
  title: string;
  subtitle?: string;
  back?: string | false;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-5 pt-5 pb-3">
      {back !== false && (
        <Link
          to={back as string}
          className="glass flex size-10 items-center justify-center rounded-full"
          aria-label="Back"
        >
          <ChevronLeft className="size-5" />
        </Link>
      )}
      <div className="flex-1">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
}
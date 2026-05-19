import { cn } from "@/lib/utils";

export function Logo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-pink-300 via-pink-400 to-rose-500 text-white glow-pink",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none">
        <path
          d="M7 5v14M17 5v14M7 12h10"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <circle cx="12" cy="19.5" r="1.4" fill="currentColor" />
      </svg>
    </div>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo size={36} />
      <div className="leading-none">
        <div className="text-xl font-semibold tracking-tight">
          Her<span className="text-rose-500">Ride</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Safe • Premium • Trusted
        </div>
      </div>
    </div>
  );
}
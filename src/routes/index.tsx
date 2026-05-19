import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "@/components/Logo";
import { PhoneFrame } from "@/components/PhoneFrame";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/onboarding" }), 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <PhoneFrame bare>
      <div className="relative flex min-h-dvh flex-col items-center justify-center px-8 text-center">
        <div className="floaty">
          <Logo size={104} />
        </div>
        <h1 className="mt-8 text-4xl font-semibold tracking-tight">
          Her<span className="text-rose-500">Ride</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Safe rides for women, by women.
        </p>
        <div className="absolute bottom-10 flex items-center gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-rose-400" />
          <span className="size-1.5 animate-pulse rounded-full bg-rose-400 [animation-delay:150ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-rose-400 [animation-delay:300ms]" />
        </div>
      </div>
    </PhoneFrame>
  );
}

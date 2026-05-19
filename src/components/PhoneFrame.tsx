import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PhoneFrame({
  children,
  className,
  bare = false,
}: {
  children: ReactNode;
  className?: string;
  bare?: boolean;
}) {
  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-rose-50 via-pink-50 to-white py-0 md:py-8">
      <div
        className={cn(
          "phone-frame md:rounded-[2.5rem] md:shadow-2xl md:border md:border-white/60",
          !bare && "pb-24",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
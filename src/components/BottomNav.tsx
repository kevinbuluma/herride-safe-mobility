import { Link, useLocation } from "@tanstack/react-router";
import { Home, Car, ShieldCheck, Wallet, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/trips", label: "Trips", icon: Car },
  { to: "/safety", label: "Safety", icon: ShieldCheck },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-3 left-1/2 z-40 w-[min(26rem,calc(100%-1.5rem))] -translate-x-1/2">
      <div className="glass flex items-center justify-around rounded-full px-2 py-2 shadow-xl">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-full px-3 py-1.5 text-[10px] transition-all",
                active
                  ? "bg-gradient-to-br from-pink-400 to-rose-500 text-white glow-pink"
                  : "text-muted-foreground hover:text-rose-500",
              )}
            >
              <Icon className="size-5" strokeWidth={2.2} />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
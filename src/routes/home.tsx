import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Search, Home as HomeIcon, Briefcase, GraduationCap, Star,
  Sparkles, Moon, Users, Crown, ShieldCheck, Bell,
} from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { MapMock } from "@/components/MapMock";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/home")({ component: HomeScreen });

const quick = [
  { icon: HomeIcon, label: "Home" },
  { icon: Briefcase, label: "Work" },
  { icon: GraduationCap, label: "University" },
  { icon: Star, label: "Saved" },
];

const rides = [
  { icon: Sparkles, label: "HerBasic", desc: "Affordable daily rides", price: "KES 280" },
  { icon: Crown, label: "HerComfort", desc: "Premium comfort", price: "KES 520" },
  { icon: Users, label: "HerShare", desc: "Shared, verified women", price: "KES 180" },
  { icon: Moon, label: "HerNight", desc: "Night-safe monitored", price: "KES 420" },
  { icon: GraduationCap, label: "HerStudent", desc: "Discounted campus", price: "KES 150" },
];

function HomeScreen() {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between px-5 pt-6">
        <div className="flex items-center gap-2">
          <Logo size={36} />
          <div>
            <p className="text-[11px] text-muted-foreground">Good evening</p>
            <p className="text-sm font-semibold">Amani 👋</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="glass grid size-10 place-items-center rounded-full">
            <Bell className="size-4" />
          </div>
          <Link to="/sos" className="grid size-10 place-items-center rounded-full bg-rose-500 text-xs font-bold text-white pulse-glow">
            SOS
          </Link>
        </div>
      </div>

      <div className="px-5 pt-4">
        <MapMock height={260} />
      </div>

      <div className="px-5 pt-4">
        <Link
          to="/book"
          className="glass flex items-center gap-3 rounded-2xl px-4 py-4 shadow-sm"
        >
          <Search className="size-5 text-rose-500" />
          <span className="flex-1 text-sm text-muted-foreground">Where to?</span>
          <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-medium text-rose-600">
            Now
          </span>
        </Link>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {quick.map(({ icon: Icon, label }) => (
            <button key={label} className="glass flex flex-col items-center gap-1 rounded-2xl py-3">
              <Icon className="size-5 text-rose-500" />
              <span className="text-[11px] font-medium">{label}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <h2 className="text-base font-semibold">Choose your ride</h2>
          <span className="text-xs text-rose-500">See all</span>
        </div>

        <div className="mt-3 -mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
          {rides.map(({ icon: Icon, label, desc, price }) => (
            <Link
              key={label}
              to="/book"
              className="glass min-w-[170px] shrink-0 rounded-2xl p-4 transition hover:-translate-y-0.5"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-pink-100 to-rose-200">
                <Icon className="size-5 text-rose-600" />
              </div>
              <p className="mt-3 text-sm font-semibold">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
              <p className="mt-2 text-sm font-semibold text-rose-600">{price}</p>
            </Link>
          ))}
        </div>

        <div className="mt-6 glass flex items-center gap-3 rounded-2xl p-4">
          <ShieldCheck className="size-8 text-rose-500" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Your trusted ride home</p>
            <p className="text-[11px] text-muted-foreground">
              All drivers background-checked & community verified.
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </PhoneFrame>
  );
}
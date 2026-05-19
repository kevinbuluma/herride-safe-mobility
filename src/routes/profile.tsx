import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Settings, CreditCard, ShieldCheck, Star, GraduationCap, ChevronRight, Crown, Moon } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";

export const Route = createFileRoute("/profile")({ component: ProfileScreen });

const plans = [
  { icon: Star, name: "HerDaily", desc: "Daily commuter savings" },
  { icon: GraduationCap, name: "HerStudent", desc: "Campus transport plan" },
  { icon: Crown, name: "HerProfessional", desc: "Business bundle" },
  { icon: Moon, name: "HerNightSecure", desc: "Late-night protection" },
];

function ProfileScreen() {
  return (
    <PhoneFrame>
      <ScreenHeader title="Profile" subtitle="Verification & preferences" back={false} />
      <div className="px-5">
        <div className="glass flex items-center gap-4 rounded-3xl p-5">
          <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-pink-300 to-rose-500 text-2xl font-bold text-white">
            A
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <p className="text-base font-semibold">Amani Wanjiru</p>
              <BadgeCheck className="size-4 text-rose-500" />
            </div>
            <p className="text-[11px] text-muted-foreground">Verified rider • 142 trips</p>
            <p className="mt-1 inline-flex items-center gap-1 text-[11px] text-rose-600">
              <Star className="size-3 fill-rose-500 text-rose-500" /> 4.98 rating
            </p>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-semibold">Subscription plans</h2>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {plans.map(({ icon: Icon, name, desc }) => (
              <div key={name} className="glass rounded-2xl p-4">
                <Icon className="size-5 text-rose-500" />
                <p className="mt-2 text-sm font-semibold">{name}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
                <button className="mt-2 w-full rounded-xl bg-rose-500 py-1.5 text-[11px] font-medium text-white glow-pink">
                  Activate
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 glass divide-y divide-white/60 rounded-2xl">
          <Row icon={ShieldCheck} label="Safety settings" to="/safety" />
          <Row icon={CreditCard} label="Payment methods" to="/wallet" />
          <Row icon={GraduationCap} label="Student verification" />
          <Row icon={Settings} label="App preferences" />
        </div>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          HerRide • Moving women safely across Africa.
        </p>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}

function Row({ icon: Icon, label, to }: { icon: typeof Settings; label: string; to?: string }) {
  const inner = (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon className="size-4 text-rose-500" />
      <span className="flex-1 text-sm">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground" />
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : <button className="w-full text-left">{inner}</button>;
}
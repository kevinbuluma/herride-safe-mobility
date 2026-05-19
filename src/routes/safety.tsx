import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Users, Share2, Moon, Mic, EyeOff } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";

export const Route = createFileRoute("/safety")({ component: SafetyScreen });

const tools = [
  { icon: Share2, label: "Trip sharing", desc: "Live location to trusted contacts" },
  { icon: Moon, label: "Night-safe mode", desc: "Auto-monitor late rides" },
  { icon: Mic, label: "Audio safety", desc: "Background safety recording" },
  { icon: EyeOff, label: "Silent SOS", desc: "Discreet distress trigger" },
];

function SafetyScreen() {
  return (
    <PhoneFrame>
      <ScreenHeader title="Safety center" subtitle="Confidence in every journey" back={false} />
      <div className="px-5">
        <Link to="/sos" className="block rounded-3xl bg-gradient-to-br from-rose-500 to-pink-500 p-5 text-white glow-pink">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-8" />
            <div>
              <p className="text-lg font-semibold">Activate SOS</p>
              <p className="text-xs text-white/85">Hold to alert contacts & responders</p>
            </div>
          </div>
        </Link>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {tools.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass rounded-2xl p-4">
              <Icon className="size-6 text-rose-500" />
              <p className="mt-2 text-sm font-semibold">{label}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 glass rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-rose-500" />
            <p className="text-sm font-semibold">Trusted contacts</p>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Mum</span>
              <span className="text-xs text-muted-foreground">+254 712 ••• 991</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Wanjiru (Sister)</span>
              <span className="text-xs text-muted-foreground">+254 700 ••• 102</span>
            </div>
          </div>
          <button className="mt-3 w-full rounded-xl border border-dashed border-rose-300 py-2 text-xs text-rose-600">
            + Add trusted contact
          </button>
        </div>

        <div className="mt-5 glass rounded-2xl p-4">
          <p className="text-sm font-semibold">Community safety tip</p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            "Always confirm the driver's plate and verified badge before entering the vehicle.
            HerRide drivers will always greet you by name."
          </p>
        </div>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
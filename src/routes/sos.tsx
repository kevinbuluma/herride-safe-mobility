import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert, PhoneCall, MapPin, Mic, EyeOff } from "lucide-react";

export const Route = createFileRoute("/sos")({ component: SOS });

function SOS() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-rose-600 via-rose-500 to-pink-500 py-0 md:py-8">
      <div className="phone-frame md:rounded-[2.5rem] !bg-transparent text-white">
        <div className="flex items-center justify-between px-5 pt-6">
          <Link to="/trip" className="text-sm text-white/80">Cancel</Link>
          <span className="text-xs uppercase tracking-widest text-white/80">Emergency</span>
          <span />
        </div>

        <div className="flex flex-col items-center px-6 pt-10 text-center">
          <div className="relative grid size-48 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
            <span className="absolute inset-6 animate-ping rounded-full bg-white/30 [animation-delay:300ms]" />
            <button className="relative grid size-36 place-items-center rounded-full bg-white text-rose-600 shadow-2xl">
              <ShieldAlert className="size-14" />
            </button>
          </div>
          <h1 className="mt-8 text-3xl font-semibold">Hold to alert</h1>
          <p className="mt-2 max-w-xs text-sm text-white/85">
            We'll alert your trusted contacts, push your live location, and connect local
            emergency services.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 px-5">
          <Action icon={PhoneCall} label="Call 999" />
          <Action icon={MapPin} label="Share live GPS" />
          <Action icon={Mic} label="Panic recording" />
          <Action icon={EyeOff} label="Silent distress" />
        </div>

        <p className="mt-10 px-6 pb-10 text-center text-xs text-white/80">
          Moving women safely. Confidence in every journey.
        </p>
      </div>
    </div>
  );
}

function Action({ icon: Icon, label }: { icon: typeof PhoneCall; label: string }) {
  return (
    <button className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-4 text-left backdrop-blur">
      <Icon className="size-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, MapPin, Users, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

const slides = [
  {
    icon: ShieldCheck,
    title: "Safe rides designed for women",
    body: "Female riders. Female drivers. Verified, trusted, and monitored end to end.",
  },
  {
    icon: Users,
    title: "Verified female drivers",
    body: "Background checks, ID verification, and community trust scoring on every driver.",
  },
  {
    icon: MapPin,
    title: "Share every trip with loved ones",
    body: "Live location sharing with trusted contacts on every ride, automatically.",
  },
  {
    icon: Sparkles,
    title: "Affordable commuting made simple",
    body: "Daily, student and night plans that fit your life. Confidence in every journey.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const s = slides[i];
  const Icon = s.icon;
  const last = i === slides.length - 1;
  return (
    <PhoneFrame bare>
      <div className="flex min-h-dvh flex-col px-6 pb-10 pt-8">
        <div className="flex items-center justify-between">
          <Logo size={40} />
          <Link to="/login" className="text-sm text-muted-foreground">
            Skip
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-200/60 to-rose-300/40 blur-2xl" />
            <div className="floaty relative grid size-44 place-items-center rounded-[2rem] bg-white/70 backdrop-blur glow-pink">
              <Icon className="size-20 text-rose-500" strokeWidth={1.6} />
            </div>
          </div>
          <h2 className="max-w-xs text-2xl font-semibold tracking-tight">{s.title}</h2>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{s.body}</p>
        </div>

        <div className="mb-6 flex justify-center gap-1.5">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-rose-500" : "w-1.5 bg-rose-200"
              }`}
            />
          ))}
        </div>

        {last ? (
          <Button asChild size="lg" className="h-14 rounded-2xl bg-rose-500 text-base hover:bg-rose-600 glow-pink">
            <Link to="/login">Get Started</Link>
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={() => setI(i + 1)}
            className="h-14 rounded-2xl bg-rose-500 text-base hover:bg-rose-600 glow-pink"
          >
            Continue
          </Button>
        )}
      </div>
    </PhoneFrame>
  );
}
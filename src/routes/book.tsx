import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Circle, MapPin, Clock, Sparkles, Crown, Users, Moon, GraduationCap } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { ScreenHeader } from "@/components/ScreenHeader";
import { MapMock } from "@/components/MapMock";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/book")({ component: Book });

const rides = [
  { id: "basic", icon: Sparkles, label: "HerBasic", desc: "Affordable daily", eta: "4 min", price: 280 },
  { id: "comfort", icon: Crown, label: "HerComfort", desc: "Premium comfort", eta: "6 min", price: 520 },
  { id: "share", icon: Users, label: "HerShare", desc: "Verified women", eta: "8 min", price: 180 },
  { id: "night", icon: Moon, label: "HerNight", desc: "Night-safe", eta: "5 min", price: 420 },
  { id: "student", icon: GraduationCap, label: "HerStudent", desc: "Campus discount", eta: "7 min", price: 150 },
];

function Book() {
  const [sel, setSel] = useState("basic");
  return (
    <PhoneFrame>
      <ScreenHeader title="Plan your ride" subtitle="Pick-up & destination" back="/home" />

      <div className="px-5">
        <div className="glass space-y-3 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <Circle className="size-3 text-rose-500" fill="currentColor" />
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              defaultValue="Current location"
            />
          </div>
          <div className="h-px bg-border" />
          <div className="flex items-center gap-3">
            <MapPin className="size-4 text-rose-500" />
            <input
              className="flex-1 bg-transparent text-sm outline-none"
              placeholder="Where to?"
              defaultValue="USIU-Africa, Thika Rd"
            />
          </div>
        </div>

        <div className="mt-4">
          <MapMock height={180} />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Choose your ride</h2>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" /> Now
          </span>
        </div>

        <div className="mt-2 space-y-2">
          {rides.map(({ id, icon: Icon, label, desc, eta, price }) => (
            <button
              key={id}
              onClick={() => setSel(id)}
              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${
                sel === id ? "bg-rose-500/10 ring-2 ring-rose-400" : "glass"
              }`}
            >
              <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-pink-100 to-rose-200">
                <Icon className="size-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-[11px] text-muted-foreground">
                  {desc} • ETA {eta}
                </p>
              </div>
              <p className="text-sm font-semibold">KES {price}</p>
            </button>
          ))}
        </div>

        <Button asChild size="lg" className="mt-4 h-14 w-full rounded-2xl bg-rose-500 text-base hover:bg-rose-600 glow-pink">
          <Link to="/trip">Confirm HerRide</Link>
        </Button>
      </div>
    </PhoneFrame>
  );
}
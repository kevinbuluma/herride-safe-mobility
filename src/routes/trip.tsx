import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, MessageCircle, Share2, ShieldAlert, Star, BadgeCheck } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { MapMock } from "@/components/MapMock";
import { ScreenHeader } from "@/components/ScreenHeader";

export const Route = createFileRoute("/trip")({ component: Trip });

function Trip() {
  const [phase, setPhase] = useState<"matching" | "ontheway">("matching");
  useEffect(() => {
    const t = setTimeout(() => setPhase("ontheway"), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <PhoneFrame>
      <ScreenHeader
        title={phase === "matching" ? "Finding your driver" : "Driver on the way"}
        subtitle={phase === "matching" ? "Matching verified female drivers near you" : "Arriving in 4 min"}
        back="/book"
      />
      <div className="px-5">
        <MapMock height={300} />
      </div>

      <div className="px-5 pt-4">
        {phase === "matching" ? (
          <div className="glass flex items-center gap-4 rounded-3xl p-5">
            <div className="relative grid size-14 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-rose-300/40" />
              <span className="relative grid size-12 place-items-center rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white">
                <ShieldAlert className="size-5" />
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold">Verifying nearby drivers…</p>
              <p className="text-[11px] text-muted-foreground">
                Background checked • Community trusted
              </p>
            </div>
          </div>
        ) : (
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-pink-200 to-rose-300 text-lg font-bold text-rose-700">
                W
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold">Wanjiku M.</p>
                  <BadgeCheck className="size-4 text-rose-500" />
                </div>
                <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Star className="size-3 fill-rose-500 text-rose-500" /> 4.96 • 2,184 trips
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">KDA 482F</p>
                <p className="text-[11px] text-muted-foreground">Toyota Vitz • Pink</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="rounded-xl bg-rose-50 p-2">
                <p className="font-semibold text-rose-700">Verified</p>
                <p className="text-muted-foreground">Background</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-2">
                <p className="font-semibold text-rose-700">Trusted</p>
                <p className="text-muted-foreground">Community</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-2">
                <p className="font-semibold text-rose-700">98%</p>
                <p className="text-muted-foreground">Safety score</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              <button className="glass flex flex-col items-center gap-1 rounded-2xl py-3 text-[10px]">
                <Phone className="size-4 text-rose-500" /> Call
              </button>
              <button className="glass flex flex-col items-center gap-1 rounded-2xl py-3 text-[10px]">
                <MessageCircle className="size-4 text-rose-500" /> Chat
              </button>
              <button className="glass flex flex-col items-center gap-1 rounded-2xl py-3 text-[10px]">
                <Share2 className="size-4 text-rose-500" /> Share
              </button>
              <Link
                to="/sos"
                className="flex flex-col items-center gap-1 rounded-2xl bg-rose-500 py-3 text-[10px] font-semibold text-white glow-pink"
              >
                <ShieldAlert className="size-4" /> SOS
              </Link>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
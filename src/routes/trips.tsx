import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";

export const Route = createFileRoute("/trips")({ component: TripsScreen });

const trips = [
  { route: "Home → Westlands Office", driver: "Wanjiku M.", date: "Today, 7:42 PM", price: 520, rating: 5, type: "HerComfort" },
  { route: "USIU → Roysambu", driver: "Achieng O.", date: "Yesterday", price: 150, rating: 5, type: "HerStudent" },
  { route: "CBD → Kilimani (Night)", driver: "Faith K.", date: "Sat", price: 420, rating: 4, type: "HerNight" },
  { route: "Westlands → Lavington", driver: "Mary N.", date: "Fri", price: 180, rating: 5, type: "HerShare" },
];

function TripsScreen() {
  return (
    <PhoneFrame>
      <ScreenHeader title="Your trips" subtitle="History & favorite drivers" back={false} />
      <div className="px-5 space-y-3">
        {trips.map((t) => (
          <div key={t.route} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 grid size-9 place-items-center rounded-xl bg-rose-100 text-rose-600">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.route}</p>
                  <p className="text-[11px] text-muted-foreground">{t.driver} • {t.date}</p>
                  <span className="mt-1 inline-block rounded-full bg-rose-50 px-2 py-0.5 text-[10px] text-rose-600">
                    {t.type}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">KES {t.price}</p>
                <p className="flex items-center justify-end gap-0.5 text-[11px] text-muted-foreground">
                  <Star className="size-3 fill-rose-500 text-rose-500" /> {t.rating}.0
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}
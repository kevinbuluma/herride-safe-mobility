import { createFileRoute } from "@tanstack/react-router";
import { Plus, CreditCard, Smartphone, Tag, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";

export const Route = createFileRoute("/wallet")({ component: WalletScreen });

const tx = [
  { name: "HerComfort • Westlands", date: "Today, 7:42 PM", amount: -520, in: false },
  { name: "Wallet top-up • M-Pesa", date: "Today, 6:10 PM", amount: 2000, in: true },
  { name: "HerStudent • USIU", date: "Yesterday", amount: -150, in: false },
  { name: "Promo code SAFE20", date: "Mon", amount: 200, in: true },
];

function WalletScreen() {
  return (
    <PhoneFrame>
      <ScreenHeader title="Wallet" subtitle="Balance, cards & promos" back={false} />
      <div className="px-5">
        <div className="rounded-3xl bg-gradient-to-br from-pink-400 via-rose-500 to-rose-600 p-5 text-white glow-pink">
          <p className="text-xs uppercase tracking-wider text-white/80">HerRide Wallet</p>
          <p className="mt-2 text-4xl font-semibold">KES 4,820</p>
          <p className="mt-1 text-xs text-white/85">+ 320 saved this week with HerStudent</p>
          <div className="mt-4 flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/20 py-2 text-xs backdrop-blur">
              <Plus className="size-4" /> Top up
            </button>
            <button className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/20 py-2 text-xs backdrop-blur">
              <Tag className="size-4" /> Promo
            </button>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-semibold">Payment methods</h2>
          <div className="mt-2 space-y-2">
            <Method icon={Smartphone} label="M-Pesa • +254 712 ••• 678" tag="Default" />
            <Method icon={CreditCard} label="Visa •••• 4421" />
          </div>
        </div>

        <div className="mt-5">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <div className="mt-2 glass divide-y divide-white/60 rounded-2xl">
            {tx.map((t) => (
              <div key={t.name} className="flex items-center gap-3 px-4 py-3">
                <div className={`grid size-9 place-items-center rounded-xl ${t.in ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                  {t.in ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.date}</p>
                </div>
                <p className={`text-sm font-semibold ${t.in ? "text-emerald-600" : ""}`}>
                  {t.in ? "+" : "−"}KES {Math.abs(t.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </PhoneFrame>
  );
}

function Method({ icon: Icon, label, tag }: { icon: typeof CreditCard; label: string; tag?: string }) {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
      <Icon className="size-5 text-rose-500" />
      <span className="flex-1 text-sm font-medium">{label}</span>
      {tag && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] text-rose-600">{tag}</span>}
    </div>
  );
}
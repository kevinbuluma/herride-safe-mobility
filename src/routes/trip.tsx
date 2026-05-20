import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Phone,
  MessageCircle,
  Share2,
  ShieldAlert,
  Star,
  BadgeCheck,
  X,
  Copy,
  Check,
  MapPin,
  Clock,
  UserCheck,
  AlertCircle,
  Settings2,
  Send,
  MessageSquare
} from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { MapMock } from "@/components/MapMock";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const Route = createFileRoute("/trip")({ component: Trip });

function Trip() {
  const [phase, setPhase] = useState<"matching" | "ontheway">("matching");

  // --- TRIP SHARING STATES ---
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [contacts, setContacts] = useState([
    { id: "c-1", name: "Mom (Muthoni)", phone: "+254 722 ••• 123", active: false },
    { id: "c-2", name: "Sister (Njeri)", phone: "+254 733 ••• 456", active: false },
    { id: "c-3", name: "Partner (Kariuki)", phone: "+254 701 ••• 789", active: false },
  ]);

  const [visibility, setVisibility] = useState({
    liveGps: true,
    driverInfo: true,
    eta: true,
    sosSync: true,
  });

  useEffect(() => {
    const t = setTimeout(() => setPhase("ontheway"), 2500);
    return () => clearTimeout(t);
  }, []);

  const activeSharingCount = contacts.filter((c) => c.active).length;

  const toggleContactShare = (id: string, activeState: boolean) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;

    setContacts(
      contacts.map((c) => (c.id === id ? { ...c, active: activeState } : c))
    );

    if (activeState) {
      toast.success(`Tracking link shared with ${contact.name.split(" ")[0]}!`, {
        description: `SMS sent to ${contact.phone}`,
      });
    } else {
      toast.info(`Stopped sharing with ${contact.name.split(" ")[0]}.`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://herride.live/track/c8x2-99d8");
    setCopied(true);
    toast.success("Tracking link copied!", {
      description: "You can paste the secure link to share your trip details.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateQuickShare = (platform: string) => {
    toast.success(`Shared secure link via ${platform}!`, {
      description: `Includes: ${[
        visibility.liveGps ? "Live GPS" : null,
        visibility.driverInfo ? "Driver Details" : null,
        visibility.eta ? "ETA Tracker" : null,
        visibility.sosSync ? "Emergency Triggers" : null,
      ]
        .filter(Boolean)
        .join(", ")}`,
    });
  };

  return (
    <PhoneFrame>
      <ScreenHeader
        title={phase === "matching" ? "Finding your driver" : "Driver on the way"}
        subtitle={phase === "matching" ? "Matching verified female drivers near you" : "Arriving in 4 min"}
        back="/book"
      />

      {/* Active Sharing Notification Pill */}
      {activeSharingCount > 0 && (
        <div
          onClick={() => setIsShareOpen(true)}
          className="mx-5 mb-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-between cursor-pointer animate-pulse active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-800">
              Sharing Live Status with {activeSharingCount} Contact{activeSharingCount > 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-[9px] font-extrabold text-emerald-800 uppercase tracking-widest flex items-center gap-0.5">
            Manage <Settings2 className="size-3.5" />
          </span>
        </div>
      )}

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
              <button
                onClick={() => toast.success("Calling driver Wanjiku...")}
                className="glass flex flex-col items-center gap-1 rounded-2xl py-3 text-[10px] cursor-pointer hover:bg-white/10 transition-colors"
              >
                <Phone className="size-4 text-rose-500" /> Call
              </button>
              <button
                onClick={() => toast.success("Chat interface loaded")}
                className="glass flex flex-col items-center gap-1 rounded-2xl py-3 text-[10px] cursor-pointer hover:bg-white/10 transition-colors"
              >
                <MessageCircle className="size-4 text-rose-500" /> Chat
              </button>
              <button
                onClick={() => setIsShareOpen(true)}
                className="glass flex flex-col items-center gap-1 rounded-2xl py-3 text-[10px] cursor-pointer hover:bg-white/10 transition-colors"
              >
                <Share2 className="size-4 text-rose-500" /> Share
              </button>
              <Link
                to="/sos"
                className="flex flex-col items-center gap-1 rounded-2xl bg-rose-500 py-3 text-[10px] font-semibold text-white glow-pink hover:bg-rose-600 transition-colors"
              >
                <ShieldAlert className="size-4" /> SOS
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* --- SIMULATED TRIP SHARING SLIDING BOTTOM SHEET --- */}
      {isShareOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white pb-6 pt-5 px-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[92%] overflow-y-auto">
            {/* Sheet Handle bar */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-foreground">Share Live Journey</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">Let your trusted contacts monitor your safety.</p>
              </div>
              <button
                onClick={() => setIsShareOpen(false)}
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* 1. Trusted Contacts SMS Share */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block pl-1">
                  Trusted Contacts SMS Broadcast
                </span>
                <div className="space-y-2 bg-gray-50/50 rounded-2xl border border-gray-100 p-3">
                  {contacts.map((c) => (
                    <div key={c.id} className="flex items-center justify-between py-1.5">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{c.phone}</p>
                      </div>
                      <Switch
                        checked={c.active}
                        onCheckedChange={(val) => toggleContactShare(c.id, val)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Route Visibility Parameters */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block pl-1">
                  Route Visibility Controls
                </span>
                <div className="grid grid-cols-2 gap-2 bg-gray-50/50 rounded-2xl border border-gray-100 p-3">
                  {/* GPS */}
                  <div className="flex items-center justify-between py-1 px-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="size-4 text-rose-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-foreground block truncate">Live GPS</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={visibility.liveGps}
                      onChange={(e) => setVisibility({ ...visibility, liveGps: e.target.checked })}
                      className="accent-rose-500 size-4 cursor-pointer"
                    />
                  </div>

                  {/* Driver Details */}
                  <div className="flex items-center justify-between py-1 px-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <UserCheck className="size-4 text-rose-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-foreground block truncate">Driver Info</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={visibility.driverInfo}
                      onChange={(e) => setVisibility({ ...visibility, driverInfo: e.target.checked })}
                      className="accent-rose-500 size-4 cursor-pointer"
                    />
                  </div>

                  {/* ETA Tracker */}
                  <div className="flex items-center justify-between py-1 px-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Clock className="size-4 text-rose-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-foreground block truncate">Arrival ETA</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={visibility.eta}
                      onChange={(e) => setVisibility({ ...visibility, eta: e.target.checked })}
                      className="accent-rose-500 size-4 cursor-pointer"
                    />
                  </div>

                  {/* SOS Alarms sync */}
                  <div className="flex items-center justify-between py-1 px-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <AlertCircle className="size-4 text-rose-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-foreground block truncate">SOS Sync</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={visibility.sosSync}
                      onChange={(e) => setVisibility({ ...visibility, sosSync: e.target.checked })}
                      className="accent-rose-500 size-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Secure Share URL Copy Link */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block pl-1">
                  Secure Sharing Link
                </span>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex items-center font-mono text-[10px] text-zinc-600 select-all overflow-hidden truncate">
                    https://herride.live/track/c8x2-99d8
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 bg-rose-500 hover:bg-rose-600 rounded-xl text-white flex items-center justify-center transition-colors active:scale-[0.96] cursor-pointer"
                    title="Copy Secure Link"
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  </button>
                </div>
              </div>

              {/* 4. Platform Quick Shares */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground block pl-1">
                  Send to Other Apps
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => simulateQuickShare("WhatsApp")}
                    className="py-2.5 rounded-xl border border-gray-250 bg-white text-[10px] font-bold text-foreground hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="size-3.5 text-emerald-500 rotate-[45deg]" /> WhatsApp
                  </button>
                  <button
                    onClick={() => simulateQuickShare("Telegram")}
                    className="py-2.5 rounded-xl border border-gray-250 bg-white text-[10px] font-bold text-foreground hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="size-3.5 text-blue-500" /> Telegram
                  </button>
                  <button
                    onClick={() => simulateQuickShare("SMS App")}
                    className="py-2.5 rounded-xl border border-gray-250 bg-white text-[10px] font-bold text-foreground hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="size-3.5 text-rose-500" /> Messaging
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
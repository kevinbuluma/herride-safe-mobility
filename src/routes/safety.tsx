import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Users,
  Share2,
  Moon,
  Mic,
  EyeOff,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Shield,
  Award,
  ChevronRight,
  Sparkles,
  Info,
  UserCheck,
  Trash2,
  Settings2
} from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/safety")({ component: SafetyScreen });

// LocalStorage Keys
const NIGHT_SAFE_KEY = "herride_safety_night_safe";
const AUDIO_SAFETY_KEY = "herride_safety_audio_safety";
const ELITE_MATCH_KEY = "herride_safety_elite_match";
const CONTACTS_KEY = "herride_safety_contacts";

const DEFAULT_CONTACTS = [
  { id: "contact-1", name: "Mum", phone: "+254 712 ••• 991", verified: true },
  { id: "contact-2", name: "Wanjiru (Sister)", phone: "+254 700 ••• 102", verified: true },
];

function SafetyScreen() {
  // --- STATE ---
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem(CONTACTS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CONTACTS;
  });

  const [nightSafe, setNightSafe] = useState<boolean>(() => {
    const saved = localStorage.getItem(NIGHT_SAFE_KEY);
    return saved ? saved === "true" : true;
  });

  const [audioSafety, setAudioSafety] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUDIO_SAFETY_KEY);
    return saved ? saved === "true" : false;
  });

  const [eliteMatch, setEliteMatch] = useState<boolean>(() => {
    const saved = localStorage.getItem(ELITE_MATCH_KEY);
    return saved ? saved === "true" : false;
  });

  // Modals
  const [isScoreOpen, setIsScoreOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  // Add Contact Form
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  // --- SYNC TO STORAGE ---
  useEffect(() => {
    localStorage.setItem(NIGHT_SAFE_KEY, nightSafe.toString());
  }, [nightSafe]);

  useEffect(() => {
    localStorage.setItem(AUDIO_SAFETY_KEY, audioSafety.toString());
  }, [audioSafety]);

  useEffect(() => {
    localStorage.setItem(ELITE_MATCH_KEY, eliteMatch.toString());
  }, [eliteMatch]);

  useEffect(() => {
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  // --- TRUST SCORE FORMULA (DYNAMIC) ---
  // Base Score: 50
  // ID Verification: +15
  // Phone Verification: +10
  // Trusted Contacts Added: +10 (5 pts each, max 10)
  // Security Settings Active: +5 (nightSafe 1, audioSafety 2, eliteMatch 2)
  // Community Vouch: +10 (constant)
  const baseScore = 50;
  const idScore = 15;
  const phoneScore = 10;
  const contactsScore = Math.min(10, contacts.length * 5);
  const settingsScore = (nightSafe ? 1 : 0) + (audioSafety ? 2 : 0) + (eliteMatch ? 2 : 0);
  const vouchScore = 10;
  const trustScore = baseScore + idScore + phoneScore + contactsScore + settingsScore + vouchScore;

  // --- ACTIONS ---
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) {
      toast.error("Please fill in both name and phone");
      return;
    }

    const newContact = {
      id: `c-${Date.now()}`,
      name: newContactName,
      phone: newContactPhone,
      verified: true, // Auto-verified for simulation
    };

    setContacts([...contacts, newContact]);
    toast.success(`${newContactName} added to trusted contacts!`, {
      description: "A secure verification link has been sent via SMS.",
    });

    // Reset Form
    setNewContactName("");
    setNewContactPhone("");
    setIsAddContactOpen(false);
  };

  const handleDeleteContact = (id: string, name: string) => {
    setContacts(contacts.filter((c: any) => c.id !== id));
    toast.info(`${name} removed from safety circle`);
  };

  return (
    <PhoneFrame>
      <ScreenHeader title="Safety Center" subtitle="Confidence in every journey" back={false} />

      <div className="px-5 space-y-5 pb-24">
        {/* Dynamic Safety Shield Trust Score Card */}
        <div
          onClick={() => setIsScoreOpen(true)}
          className="rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-rose-600 p-5 text-white glow-pink relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
        >
          {/* Highlights */}
          <div className="absolute right-0 top-0 size-24 bg-white/10 rounded-full blur-xl translate-x-1/3 -translate-y-1/3 animate-pulse" />
          
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                Safety Trust Score
              </span>
              <h2 className="text-2xl font-bold tracking-tight mt-1 flex items-center gap-1.5">
                <ShieldCheck className="size-6 text-white" /> Shield Level: {trustScore}%
              </h2>
              <p className="text-[10px] text-white/85 leading-relaxed max-w-[200px]">
                Score is based on ID checks, trusted circles, and settings. Tap to view pillars.
              </p>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative size-18 shrink-0">
              <svg className="size-full transform -rotate-90">
                <circle cx="36" cy="36" r="30" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="4.5" fill="transparent" />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  stroke="#ffffff"
                  strokeWidth="4.5"
                  fill="transparent"
                  strokeDasharray="188.4"
                  strokeDashoffset={188.4 - (188.4 * trustScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-black font-mono">
                {trustScore}%
              </span>
            </div>
          </div>

          <div className="mt-4.5 pt-3.5 border-t border-white/15 flex items-center justify-between text-[10px] text-white/80">
            <span className="flex items-center gap-1">
              <Sparkles className="size-3" /> Level: Elite Safety Verified
            </span>
            <span className="font-semibold underline flex items-center gap-0.5">
              Breakdown <ChevronRight className="size-3" />
            </span>
          </div>
        </div>

        {/* SOS Alert Trigger Shortcut */}
        <Link
          to="/sos"
          className="block rounded-2xl bg-red-900/10 border border-red-500/20 p-4 hover:bg-red-900/20 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-red-500/20 text-red-600 rounded-xl grid place-items-center animate-pulse">
                <Shield className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-900">Activate SOS Emergency</p>
                <p className="text-[10px] text-red-700/80">Hold to alert HerRide Incident Dispatch & Contacts</p>
              </div>
            </div>
            <ChevronRight className="size-4 text-red-500 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>

        {/* Background Check Verification Badges */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-foreground pl-0.5">Verification Badges</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="glass rounded-xl p-3 flex items-center gap-2.5 border border-white/60">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-foreground">Identity Verified</p>
                <p className="text-[9px] text-muted-foreground">National ID Checked</p>
              </div>
            </div>

            <div className="glass rounded-xl p-3 flex items-center gap-2.5 border border-white/60">
              <CheckCircle2 className="size-5 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-foreground">Phone Linked</p>
                <p className="text-[9px] text-muted-foreground">+254 712 ••• 678</p>
              </div>
            </div>

            <div className="glass rounded-xl p-3 flex items-center gap-2.5 border border-white/60">
              <Award className="size-5 text-rose-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-foreground">Community Vouched</p>
                <p className="text-[9px] text-muted-foreground">12 Friend Vouches</p>
              </div>
            </div>

            <div className="glass rounded-xl p-3 flex items-center gap-2.5 border border-white/60">
              <UserCheck className="size-5 text-rose-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-foreground">5-Star Passenger</p>
                <p className="text-[9px] text-muted-foreground">Top Driver Ratings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Settings Switches */}
        <div className="glass rounded-2xl p-4.5 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5 pb-2 border-b border-gray-100">
            <Settings2 className="size-4 text-rose-500" /> Rider Safety Settings
          </h3>

          {/* Night Safe Mode */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 max-w-[80%]">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
                <Moon className="size-3.5 text-rose-500" /> Night-Safe Mode
              </h4>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Auto-shares live GPS tracking with safety circle for all rides requested after 8:00 PM.
              </p>
            </div>
            <Switch
              checked={nightSafe}
              onCheckedChange={(checked) => {
                setNightSafe(checked);
                toast.success(checked ? "Night-Safe mode active!" : "Night-Safe mode disabled");
              }}
            />
          </div>

          {/* Audio Safety */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 max-w-[80%]">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
                <Mic className="size-3.5 text-rose-500" /> Path Deviation Audio Capture
              </h4>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Starts security mic recording automatically if route deviation is detected.
              </p>
            </div>
            <Switch
              checked={audioSafety}
              onCheckedChange={(checked) => {
                setAudioSafety(checked);
                toast.success(checked ? "Audio safety trigger enabled" : "Audio safety trigger disabled");
              }}
            />
          </div>

          {/* Elite Match */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 max-w-[80%]">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
                <Award className="size-3.5 text-rose-500" /> Match Elite Safety Drivers Only
              </h4>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Only match with drivers having 500+ completed trips and a 99% safety verification score.
              </p>
            </div>
            <Switch
              checked={eliteMatch}
              onCheckedChange={(checked) => {
                setEliteMatch(checked);
                toast.success(checked ? "Now matching with Elite Drivers only" : "Matching reset to standard");
              }}
            />
          </div>
        </div>

        {/* Trusted Safety Circle */}
        <div className="glass rounded-2xl p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="size-4.5 text-rose-500" />
              <h3 className="text-sm font-bold text-foreground">Trusted Safety Circle</h3>
            </div>
            <button
              onClick={() => setIsAddContactOpen(true)}
              className="text-xs font-bold text-rose-500 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <Plus className="size-3.5" /> Request Vouch
            </button>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">Add contacts to raise your Safety Trust Score</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100/50 space-y-2">
              {contacts.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-xs font-bold text-foreground">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{c.phone}</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-[8px] bg-emerald-100 border border-emerald-200 text-emerald-700 font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide">
                      Vouched
                    </span>
                    <button
                      onClick={() => handleDeleteContact(c.id, c.name)}
                      className="size-7 rounded-lg hover:bg-rose-50 grid place-items-center text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remove contact"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community safety tip */}
        <div className="glass rounded-2xl p-4.5 bg-rose-50/5 border border-rose-100/10">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
            <Info className="size-3.5 text-rose-500" /> Community Safety Reminder
          </h4>
          <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
            "Always match the driver's vehicle plate and verified photo credentials before boarding. HerRide drivers are trained to greet passengers by name for identity verification."
          </p>
        </div>
      </div>

      {/* --- INLINE SHEETS / BOTTOM SLIDERS --- */}

      {/* 1. SCORE BREAKDOWN DETAILS */}
      {isScoreOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white pb-6 pt-5 px-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Shield Score Breakdown</h3>
              <button
                onClick={() => setIsScoreOpen(false)}
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Safety Level</span>
                  <span className="text-2xl font-black text-rose-600 font-mono">{trustScore} / 100</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] bg-rose-100 border border-rose-200 text-rose-700 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ELITE SHIELD
                  </span>
                </div>
              </div>

              {/* Pillars list */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                  <span className="font-semibold text-foreground">Base Community Trust</span>
                  <span className="font-bold font-mono text-zinc-600">+50</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                  <span className="font-semibold text-foreground">Identity Check Approved</span>
                  <span className="font-bold font-mono text-emerald-600">+{idScore}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                  <span className="font-semibold text-foreground">Phone Number Verified</span>
                  <span className="font-bold font-mono text-emerald-600">+{phoneScore}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                  <span className="font-semibold text-foreground">Trusted Safety Circle ({contacts.length} added)</span>
                  <span className="font-bold font-mono text-emerald-600">+{contactsScore}</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-gray-100">
                  <span className="font-semibold text-foreground">Active Safety Settings</span>
                  <span className="font-bold font-mono text-emerald-600">+{settingsScore}</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="font-semibold text-foreground">Community & Driver Vouches</span>
                  <span className="font-bold font-mono text-emerald-600">+{vouchScore}</span>
                </div>
              </div>

              <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3.5 flex gap-2">
                <AlertCircle className="size-4.5 text-rose-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-rose-700 leading-normal">
                  High safety scores help match you faster with elite drivers. Boost your score by requesting more vouches from verified riders or drivers in your area.
                </p>
              </div>

              <button
                onClick={() => setIsScoreOpen(false)}
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REQUEST VOUCH / ADD CONTACT */}
      {isAddContactOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white pb-6 pt-5 px-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Request Community Vouch</h3>
              <button
                onClick={() => setIsAddContactOpen(false)}
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Contact Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Njeri Friend"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-rose-300 focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +254 700 123 456"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-rose-300 focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all font-mono"
                />
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 flex gap-2">
                <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-800 leading-normal font-medium">
                  Adding a contact to your Safety Circle raises your Trust Score by +5 points once they confirm their verification.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
              >
                Send Verification SMS
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </PhoneFrame>
  );
}
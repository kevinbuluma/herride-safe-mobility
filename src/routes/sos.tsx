import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  Mic,
  EyeOff,
  Volume2,
  MicOff,
  Lock,
  Unlock,
  Copy,
  Plus,
  PhoneOff,
  ArrowLeft,
  AlertTriangle,
  Radio,
  Clock,
  Play,
  Square,
  VolumeX,
  Volume1,
  Check,
  X
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { MapMock } from "@/components/MapMock";

export const Route = createFileRoute("/sos")({ component: SOSScreen });

type SOSMode = "idle" | "active" | "calling" | "silent" | "recording";

function SOSScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<SOSMode>("idle");

  // --- PRESS AND HOLD ACTIVE STATE ---
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- PANIC TIMER ---
  const [panicSeconds, setPanicSeconds] = useState(0);
  const panicTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- MOCK DIAL DETAILS ---
  const [activeCallTarget, setActiveCallTarget] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // --- AUDIO PANIC RECORDER ---
  const [recDuration, setRecDuration] = useState(0);
  const [isRecPaused, setIsRecPaused] = useState(false);
  const [waveformHeights, setWaveformHeights] = useState<number[]>(Array(16).fill(15));
  const recTimerRef = useRef<NodeJS.Timeout | null>(null);
  const waveformIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- SILENT DISTRESS PIN PAD ---
  const [showPinPad, setShowPinPad] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [liveLogText, setLiveLogText] = useState("Silent beacons broadcast started...");

  // --- HOLD-TO-DEACTIVATE SOS (Prevent Accidental Cancellations) ---
  const [deactivateProgress, setDeactivateProgress] = useState(0);
  const [isHoldingDeactivate, setIsHoldingDeactivate] = useState(false);
  const deactivateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- SIMULATED RECEIPTS AND LOCATION ---
  const [receipts, setReceipts] = useState([
    { name: "HerRide Command Center", status: "Tracking Live", time: "Just now", ok: true },
    { name: "Emergency Contacts (SMS)", status: "Delivered to 3 contacts", time: "1m ago", ok: true },
    { name: "Local Responder Team", status: "Alert dispatched (ETA 5 min)", time: "Just now", ok: true },
  ]);

  // --- PANIC TIMER EFFECT ---
  useEffect(() => {
    if (mode === "active") {
      panicTimerRef.current = setInterval(() => {
        setPanicSeconds((p) => p + 1);
      }, 1000);
    } else {
      if (panicTimerRef.current) clearInterval(panicTimerRef.current);
      setPanicSeconds(0);
    }
    return () => {
      if (panicTimerRef.current) clearInterval(panicTimerRef.current);
    };
  }, [mode]);

  // --- MOCK CALL TIMER EFFECT ---
  useEffect(() => {
    if (mode === "calling") {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => {
        setCallDuration((c) => c + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [mode]);

  // --- AUDIO PANIC RECORDER EFFECT & SOUNDWAVES ---
  useEffect(() => {
    if (mode === "recording" && !isRecPaused) {
      recTimerRef.current = setInterval(() => {
        setRecDuration((r) => r + 1);
      }, 1000);

      waveformIntervalRef.current = setInterval(() => {
        setWaveformHeights(
          Array(16)
            .fill(0)
            .map(() => Math.floor(Math.random() * 55) + 10)
        );
      }, 120);
    } else {
      if (recTimerRef.current) clearInterval(recTimerRef.current);
      if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
    }
    return () => {
      if (recTimerRef.current) clearInterval(recTimerRef.current);
      if (waveformIntervalRef.current) clearInterval(waveformIntervalRef.current);
    };
  }, [mode, isRecPaused]);

  // --- SILENT DISTRESS BEACON LOG SIMULATOR ---
  useEffect(() => {
    let t: NodeJS.Timeout;
    if (mode === "silent") {
      const logs = [
        "Sending GPS beacons...",
        "Secret audio streaming initiated...",
        "Command Center tracking active...",
        "Poling responder coordinates...",
        "Dispatch unit routing to your path..."
      ];
      let logIndex = 0;
      t = setInterval(() => {
        logIndex = (logIndex + 1) % logs.length;
        setLiveLogText(logs[logIndex]);
      }, 4000);
    }
    return () => clearInterval(t);
  }, [mode]);

  // --- GESTURE PRESS DOWN HANDLER (SOS ACTIVATION) ---
  const handleHoldStart = () => {
    if (mode !== "idle") return;
    setIsHolding(true);
    setHoldProgress(0);

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
          setIsHolding(false);
          triggerEmergencyActive();
          return 100;
        }
        return prev + 2.5; // Fills up in 2 seconds
      });
    }, 50);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
    }
    setHoldProgress(0);
  };

  const triggerEmergencyActive = () => {
    setMode("active");
    toast.error("SOS Emergency Activated! Location shared.", {
      description: "Trusted contacts & HerRide Security have been notified.",
      duration: 5000,
    });
  };

  // --- GESTURE HOLD-TO-DEACTIVATE SOS HANDLER ---
  const handleDeactivateStart = () => {
    setIsHoldingDeactivate(true);
    setDeactivateProgress(0);

    deactivateIntervalRef.current = setInterval(() => {
      setDeactivateProgress((prev) => {
        if (prev >= 100) {
          if (deactivateIntervalRef.current) clearInterval(deactivateIntervalRef.current);
          setIsHoldingDeactivate(false);
          deactivateSOS();
          return 100;
        }
        return prev + 4; // Fills in 1.25 seconds
      });
    }, 50);
  };

  const handleDeactivateEnd = () => {
    setIsHoldingDeactivate(false);
    if (deactivateIntervalRef.current) {
      clearInterval(deactivateIntervalRef.current);
    }
    setDeactivateProgress(0);
  };

  const deactivateSOS = () => {
    setMode("idle");
    toast.success("SOS deactivated successfully.", {
      description: "Incident responders have been updated.",
    });
  };

  // --- FORMAT TIMERS ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- CALL SIMULATOR ---
  const startCall = (target: string) => {
    setActiveCallTarget(target);
    setMode("calling");
    toast.info(`Connecting emergency call to ${target}...`);
  };

  const endCall = () => {
    setMode("active");
    toast.success("Call ended");
  };

  // --- SILENT PIN PAD HELPERS ---
  const handlePinPress = (num: string) => {
    const nextPin = pinInput + num;
    if (nextPin.length === 4) {
      if (nextPin === "1234") {
        setMode("active");
        setShowPinPad(false);
        setPinInput("");
        toast.success("Silent mode unlocked");
      } else {
        toast.error("Invalid Safe PIN");
        setPinInput("");
      }
    } else {
      setPinInput(nextPin);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-gradient-to-br from-rose-50 via-pink-50 to-white py-0 md:py-8">
      {/* simulated mobile device frame */}
      <div className={`phone-frame md:rounded-[2.5rem] md:shadow-2xl md:border md:border-white/60 relative overflow-hidden transition-all duration-300 ${
        mode === "idle" ? "bg-gradient-to-b from-rose-600 via-rose-500 to-pink-500 text-white" : ""
      } ${
        mode === "active" || mode === "recording" ? "bg-red-950 text-white" : ""
      } ${
        mode === "calling" ? "bg-zinc-950 text-white" : ""
      } ${
        mode === "silent" ? "bg-black text-zinc-500" : ""
      }`}>

        {/* Dynamic Alarm Beacon pulse for active emergency */}
        {(mode === "active" || mode === "recording") && (
          <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none z-0" />
        )}

        {/* --- 1. IDLE / SOS STANDBY SCREEN --- */}
        {mode === "idle" && (
          <div className="flex flex-col min-h-dvh pb-8">
            <div className="flex items-center justify-between px-5 pt-6 relative z-10">
              <Link to="/trip" className="text-sm text-white/80 hover:text-white flex items-center gap-1 font-semibold">
                <ArrowLeft className="size-4" /> Trip
              </Link>
              <span className="text-xs uppercase tracking-widest font-black text-white/80">SOS Center</span>
              <span className="size-4" />
            </div>

            <div className="flex flex-col items-center px-6 pt-8 text-center flex-1 justify-center">
              <div className="relative grid size-56 place-items-center">
                {/* Visual Radar Pulse Rings */}
                {isHolding ? (
                  <>
                    <span className="absolute inset-0 animate-ping rounded-full bg-white/50" />
                    <span className="absolute inset-4 animate-ping rounded-full bg-white/40 [animation-delay:200ms]" />
                  </>
                ) : (
                  <>
                    <span className="absolute inset-4 animate-pulse rounded-full bg-white/20" />
                    <span className="absolute inset-10 animate-pulse rounded-full bg-white/15 [animation-delay:300ms]" />
                  </>
                )}

                {/* SVG Progress Circle Around Button */}
                <svg className="absolute size-48 transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="84"
                    stroke="#ffffff"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray="527"
                    strokeDashoffset={527 - (527 * holdProgress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-75"
                  />
                </svg>

                {/* Holdable SOS Button */}
                <button
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={handleHoldEnd}
                  className={`relative grid size-36 place-items-center rounded-full bg-white text-rose-600 shadow-2xl transition-transform active:scale-[0.94] cursor-pointer select-none ${
                    isHolding ? "scale-105" : ""
                  }`}
                >
                  <ShieldAlert className="size-16" />
                </button>
              </div>

              <h1 className="mt-8 text-3xl font-extrabold tracking-tight">
                {isHolding ? `Activating in ${(2.5 - (holdProgress * 2.5) / 100).toFixed(1)}s` : "Hold to Alert"}
              </h1>
              <p className="mt-2.5 max-w-xs text-sm text-white/85 leading-relaxed">
                Press and hold the shield button to broadcast live GPS location and dispatch local emergency responders.
              </p>
            </div>

            {/* Quick Actions Panel */}
            <div className="mt-4 px-5 space-y-3 relative z-10">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/60 block pl-1">
                Quick Activations
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => startCall("National Police (999)")}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-4 text-left backdrop-blur border border-white/10 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <PhoneCall className="size-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">Call<br />Police</span>
                </button>
                <button
                  onClick={() => {
                    setMode("active");
                    toast.success("Live GPS sharing broadcast initialized.");
                  }}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-4 text-left backdrop-blur border border-white/10 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <MapPin className="size-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">Share<br />Live GPS</span>
                </button>
                <button
                  onClick={() => {
                    setMode("recording");
                    toast.info("Panic recording starting...");
                  }}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-4 text-left backdrop-blur border border-white/10 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <Mic className="size-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">Panic<br />Recorder</span>
                </button>
                <button
                  onClick={() => {
                    setMode("silent");
                    toast.info("Silent distress mode active. Screen locked.");
                  }}
                  className="flex items-center gap-3 rounded-2xl bg-white/10 hover:bg-white/15 px-4 py-4 text-left backdrop-blur border border-white/10 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <EyeOff className="size-5 shrink-0" />
                  <span className="text-xs font-bold leading-tight">Stealth<br />Silent distress</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. ACTIVE EMERGENCY MODE DASHBOARD --- */}
        {mode === "active" && (
          <div className="flex flex-col min-h-dvh pb-8 relative z-10 px-5 pt-6 space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex size-3.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full size-3.5 bg-red-500" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-red-400">SOS ACTIVE</span>
              </div>
              <div className="flex items-center gap-1.5 bg-red-900/50 border border-red-500/20 rounded-full px-3 py-1">
                <Clock className="size-3.5 text-red-400" />
                <span className="text-xs font-bold font-mono tracking-wider">{formatTime(panicSeconds)}</span>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-red-900/30 border border-red-500/30 rounded-2xl p-4.5 space-y-2">
              <h3 className="text-sm font-bold text-red-200 flex items-center gap-1.5">
                <Radio className="size-4 animate-pulse text-red-400" /> Broadcast Transmission Active
              </h3>
              <p className="text-xs text-red-100/80 leading-relaxed">
                HerRide Command Center is broadcasting your live telemetry. Immediate security response unit is dispatching to your coordinates.
              </p>
            </div>

            {/* Mock Live Map panel */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-red-400/80 block pl-1">
                Live GPS Broadcast
              </label>
              <div className="relative h-44 rounded-2xl overflow-hidden border border-red-500/20 shadow-lg">
                <MapMock height={176} />
                <div className="absolute inset-0 bg-red-900/10 pointer-events-none" />
                <div className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="size-1.5 bg-white rounded-full animate-ping" />
                  Live Location Streamed
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-red-400/80 block pl-1">
                Emergency Controls
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => startCall("HerRide Incident Response")}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl bg-red-900/20 border border-red-500/15 p-3 text-center active:scale-[0.97] transition-transform cursor-pointer"
                >
                  <PhoneCall className="size-5 text-red-400" />
                  <span className="text-[10px] font-bold text-red-200">Call Support</span>
                </button>
                <button
                  onClick={() => setMode("recording")}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl bg-red-900/20 border border-red-500/15 p-3 text-center active:scale-[0.97] transition-transform cursor-pointer"
                >
                  <Mic className="size-5 text-red-400 animate-pulse" />
                  <span className="text-[10px] font-bold text-red-200">Record Audio</span>
                </button>
                <button
                  onClick={() => setMode("silent")}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl bg-red-900/20 border border-red-500/15 p-3 text-center active:scale-[0.97] transition-transform cursor-pointer"
                >
                  <EyeOff className="size-5 text-red-400" />
                  <span className="text-[10px] font-bold text-red-200">Stealth Lock</span>
                </button>
              </div>
            </div>

            {/* Dispatch Receipts / Timeline */}
            <div className="space-y-2 flex-1">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-red-400/80 block pl-1">
                Active Tracking Timeline
              </label>
              <div className="bg-red-950/40 border border-red-500/10 rounded-2xl p-4 divide-y divide-white/10 space-y-3">
                {receipts.map((r, i) => (
                  <div key={r.name} className={`flex items-start gap-3 ${i > 0 ? "pt-3" : ""}`}>
                    <div className="size-6 bg-red-500/10 rounded-full border border-red-500/20 grid place-items-center mt-0.5 shrink-0 text-red-400">
                      <Check className="size-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-red-100">{r.name}</p>
                      <p className="text-[10px] text-red-300/80 mt-0.5">{r.status}</p>
                    </div>
                    <span className="text-[9px] text-red-400 font-mono font-medium">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Press and Hold Deactivate Slider/Button */}
            <div className="relative h-14 bg-red-900/20 border border-red-500/20 rounded-2xl overflow-hidden flex items-center justify-center">
              {/* Progress Overlay bar */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-red-600/40 transition-all duration-75"
                style={{ width: `${deactivateProgress}%` }}
              />

              <button
                onMouseDown={handleDeactivateStart}
                onMouseUp={handleDeactivateEnd}
                onMouseLeave={handleDeactivateEnd}
                onTouchStart={handleDeactivateStart}
                onTouchEnd={handleDeactivateEnd}
                className="relative z-10 w-full h-full text-xs font-extrabold uppercase tracking-widest text-red-100 hover:text-white transition-colors cursor-pointer select-none flex items-center justify-center gap-2"
              >
                {isHoldingDeactivate ? "Releasing SOS..." : "Hold to Deactivate SOS"}
              </button>
            </div>
          </div>
        )}

        {/* --- 3. MOCK CALL SCREEN --- */}
        {mode === "calling" && (
          <div className="flex flex-col min-h-dvh justify-between py-12 px-8 text-center relative z-10">
            {/* Contact details */}
            <div className="space-y-2 mt-8">
              <h2 className="text-2xl font-bold tracking-tight text-white">{activeCallTarget}</h2>
              <p className="text-xs uppercase tracking-widest text-red-500 font-extrabold animate-pulse">
                {callDuration === 0 ? "Connecting..." : "Emergency Dispatch Call"}
              </p>
              {callDuration > 0 && (
                <p className="text-sm font-semibold font-mono text-zinc-400 tracking-wider">
                  {formatTime(callDuration)}
                </p>
              )}
            </div>

            {/* Action Grid (Mock Phone actions) */}
            <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`flex flex-col items-center gap-1.5 cursor-pointer`}
              >
                <div className={`size-14 rounded-full border border-white/10 grid place-items-center transition-colors ${
                  isMuted ? "bg-white text-zinc-950" : "bg-white/10 hover:bg-white/15 text-white"
                }`}>
                  {isMuted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">Mute</span>
              </button>

              <button className="flex flex-col items-center gap-1.5 opacity-40 cursor-not-allowed">
                <div className="size-14 rounded-full bg-white/10 grid place-items-center">
                  <span className="text-base font-bold font-mono">123</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">Keypad</span>
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className={`size-14 rounded-full border border-white/10 grid place-items-center transition-colors ${
                  isSpeaker ? "bg-white text-zinc-950 font-bold" : "bg-white/10 hover:bg-white/15 text-white"
                }`}>
                  <Volume2 className="size-5" />
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">Speaker</span>
              </button>

              <button className="flex flex-col items-center gap-1.5 opacity-40 cursor-not-allowed">
                <div className="size-14 rounded-full bg-white/10 grid place-items-center">
                  <Plus className="size-5" />
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">Add Call</span>
              </button>

              <button className="flex flex-col items-center gap-1.5 opacity-40 cursor-not-allowed">
                <div className="size-14 rounded-full bg-white/10 grid place-items-center font-bold">
                  <VideoCallMock />
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">Video</span>
              </button>

              <button className="flex flex-col items-center gap-1.5 opacity-40 cursor-not-allowed">
                <div className="size-14 rounded-full bg-white/10 grid place-items-center">
                  <EyeOff className="size-5" />
                </div>
                <span className="text-[10px] text-zinc-400 font-bold">Contacts</span>
              </button>
            </div>

            {/* Hangup button */}
            <div className="mb-4">
              <button
                onClick={endCall}
                className="size-16 rounded-full bg-red-600 hover:bg-red-700 grid place-items-center text-white shadow-lg mx-auto active:scale-[0.93] transition-transform cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="size-7" />
              </button>
            </div>
          </div>
        )}

        {/* --- 4. PANIC AUDIO RECORDER SCREEN --- */}
        {mode === "recording" && (
          <div className="flex flex-col min-h-dvh pb-8 px-5 pt-6 justify-between relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-red-200 flex items-center gap-1.5">
                <Mic className="size-4 animate-pulse text-red-400" /> Secure Audio Recorder
              </h3>
              <div className="flex items-center gap-1.5 bg-red-900/50 border border-red-500/20 rounded-full px-3 py-1">
                <span className="size-1.5 bg-red-500 rounded-full animate-ping" />
                <span className="text-xs font-bold font-mono tracking-wider">{formatTime(recDuration)}</span>
              </div>
            </div>

            {/* Sound Wave Animation Visualizer */}
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <div className="h-24 flex items-end gap-1.5 justify-center w-full max-w-[240px]">
                {waveformHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-2.5 rounded-full bg-red-500 transition-all duration-100"
                    style={{
                      height: `${h}px`,
                      opacity: isRecPaused ? 0.3 : 1,
                    }}
                  />
                ))}
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm font-bold text-red-200">
                  {isRecPaused ? "Recording Paused" : "Recording & Uploading..."}
                </p>
                <p className="text-xs text-red-300/70 leading-relaxed max-w-[250px] mx-auto">
                  Audio logs are automatically encrypted and streamed to HerRide secure cloud storage as tamper-proof evidence.
                </p>
              </div>
            </div>

            {/* Recorder Controls */}
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-6">
                <button
                  type="button"
                  onClick={() => setIsRecPaused(!isRecPaused)}
                  className={`size-14 rounded-full border grid place-items-center transition-all cursor-pointer ${
                    isRecPaused
                      ? "bg-white text-zinc-950 border-white hover:bg-zinc-100"
                      : "bg-red-900/40 border-red-500/20 text-red-200 hover:bg-red-900/60"
                  }`}
                >
                  {isRecPaused ? <Play className="size-5" /> : <Square className="size-5" />}
                </button>

                <button
                  onClick={() => setMode("active")}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                >
                  Save & Return
                </button>
              </div>

              <p className="text-[10px] text-center text-red-400/80 uppercase font-black tracking-widest flex items-center justify-center gap-1">
                <AlertTriangle className="size-3.5 text-red-500" /> Tamper-Proof Live Sync Active
              </p>
            </div>
          </div>
        )}

        {/* --- 5. SILENT DISTRESS SCREEN (STEALTH MODE) --- */}
        {mode === "silent" && (
          <div
            onClick={() => {
              if (!showPinPad) {
                setShowPinPad(true);
                setPinInput("");
              }
            }}
            className="flex flex-col min-h-dvh justify-between py-12 px-6 relative z-10"
          >
            {/* Mock Locked Screen time display */}
            <div className="text-center mt-12 space-y-1">
              <h2 className="text-5xl font-light text-zinc-700 font-sans tracking-tight">10:35</h2>
              <p className="text-xs text-zinc-600 uppercase tracking-widest font-semibold">
                Wednesday, May 20
              </p>
            </div>

            {/* Stealth Activity Logs (very low contrast / hidden) */}
            <div className="max-w-xs mx-auto text-center">
              {showPinPad ? (
                /* Deactivate PIN pad Mock */
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                      <Lock className="size-3.5 text-rose-500" /> Unlock Safety Screen
                    </span>
                    <button
                      onClick={() => setShowPinPad(false)}
                      className="size-6 rounded-full bg-zinc-800 text-zinc-400 grid place-items-center hover:bg-zinc-700 cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  </div>

                  <div className="flex justify-center gap-2.5 py-1">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className={`size-3 rounded-full border transition-all ${
                            pinInput.length > i ? "bg-rose-500 border-rose-500" : "border-zinc-700"
                          }`}
                        />
                      ))}
                  </div>

                  <p className="text-[10px] text-zinc-400/80 text-center">
                    Enter Pin to exit stealth lock (Demo PIN: <strong className="text-rose-400">1234</strong>)
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => handlePinPress(n)}
                        className="py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
                      >
                        {n}
                      </button>
                    ))}
                    <div />
                    <button
                      type="button"
                      onClick={() => handlePinPress("0")}
                      className="py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold text-white transition-all cursor-pointer"
                    >
                      0
                    </button>
                    <div />
                  </div>
                </div>
              ) : (
                /* Hidden tracker status */
                <p className="text-[8px] text-zinc-900 tracking-wider select-none animate-pulse">
                  {liveLogText}
                </p>
              )}
            </div>

            {/* Bottom Safe Notification/Unlock Helper */}
            <div className="text-center">
              {!showPinPad && (
                <p className="text-[10px] text-zinc-700/60 font-medium select-none hover:text-zinc-600 transition-colors">
                  Tap screen to verify password & exit silent mode.
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Simple Helper for Video call icon Mock
function VideoCallMock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}
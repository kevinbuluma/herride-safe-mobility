import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  CreditCard,
  Smartphone,
  Tag,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Check,
  Loader2,
  Sparkles,
  ChevronRight,
  Info,
  X,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

export const Route = createFileRoute("/wallet")({ component: WalletScreen });

// LocalStorage Keys
const BALANCE_KEY = "herride_wallet_balance";
const METHODS_KEY = "herride_wallet_payment_methods";
const PROMOS_KEY = "herride_wallet_promos";
const TX_KEY = "herride_wallet_transactions";
const AUTOPAY_KEY = "herride_wallet_autopay";

const DEFAULT_METHODS = [
  { id: "method-mpesa", type: "mpesa", label: "M-Pesa • +254 712 ••• 678", phone: "+254 712 345 678", carrier: "M-Pesa", isDefault: true },
  { id: "method-visa", type: "card", label: "Visa •••• 4421", number: "•••• •••• •••• 4421", name: "JANE DOE", expiry: "12/28", isDefault: false },
];

const DEFAULT_TX = [
  { id: "tx-1", name: "HerComfort • Westlands", date: "Today, 7:42 PM", amount: -520, in: false },
  { id: "tx-2", name: "Wallet top-up • M-Pesa", date: "Today, 6:10 PM", amount: 2000, in: true },
  { id: "tx-3", name: "HerStudent • USIU", date: "Yesterday", amount: -150, in: false },
  { id: "tx-4", name: "Promo code SAFE20", date: "Mon", amount: 200, in: true },
];

const DEFAULT_PROMOS = [
  { id: "promo-safe20", code: "SAFE20", label: "SAFE20 applied • KES 200 discount active" },
];

function WalletScreen() {
  // --- STATE INITIALIZATION ---
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem(BALANCE_KEY);
    return saved ? parseInt(saved, 10) : 4820;
  });

  const [methods, setMethods] = useState(() => {
    const saved = localStorage.getItem(METHODS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_METHODS;
  });

  const [promos, setPromos] = useState(() => {
    const saved = localStorage.getItem(PROMOS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PROMOS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem(TX_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_TX;
  });

  const [autoPay, setAutoPay] = useState<boolean>(() => {
    const saved = localStorage.getItem(AUTOPAY_KEY);
    return saved ? saved === "true" : true;
  });

  // --- MODAL SHEETS STATE ---
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  // --- FORMS STATE ---
  // Top-Up Form
  const [topUpAmount, setTopUpAmount] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState("");
  const [isProcessingTopUp, setIsProcessingTopUp] = useState(false);
  const [processingStep, setProcessingStep] = useState<"none" | "stk-sent" | "authenticating" | "success">("none");
  const [stkCountdown, setStkCountdown] = useState(5);

  // Add Payment Form
  const [paymentTab, setPaymentTab] = useState<"mobile" | "card">("mobile");
  // Mobile details
  const [mobileCarrier, setMobileCarrier] = useState("M-Pesa");
  const [mobilePhone, setMobilePhone] = useState("");
  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Promo Code Form
  const [promoInput, setPromoInput] = useState("");

  // Confetti particles state
  const [confetti, setConfetti] = useState<{ id: number; color: string; left: string; delay: string }[]>([]);

  // Timer Ref for STK Countdown
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- SYNC STATE TO STORAGE ---
  useEffect(() => {
    localStorage.setItem(BALANCE_KEY, balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem(METHODS_KEY, JSON.stringify(methods));
    // If default method is removed, assign a new default
    if (methods.length > 0 && !methods.some((m: any) => m.isDefault)) {
      const updated = [...methods];
      updated[0].isDefault = true;
      setMethods(updated);
    }
  }, [methods]);

  useEffect(() => {
    localStorage.setItem(PROMOS_KEY, JSON.stringify(promos));
  }, [promos]);

  useEffect(() => {
    localStorage.setItem(TX_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(AUTOPAY_KEY, autoPay.toString());
  }, [autoPay]);

  // Set initial Top-Up funding source to default method
  useEffect(() => {
    const defaultMethod = methods.find((m: any) => m.isDefault);
    if (defaultMethod) {
      setSelectedMethodId(defaultMethod.id);
    } else if (methods.length > 0) {
      setSelectedMethodId(methods[0].id);
    }
  }, [methods, isTopUpOpen]);

  // Handle auto-pay status when payment methods list changes
  useEffect(() => {
    if (methods.length === 0 && autoPay) {
      setAutoPay(false);
    }
  }, [methods, autoPay]);

  // --- CONFETTI HANDLER ---
  const triggerConfetti = () => {
    const colors = ["#ec4899", "#f43f5e", "#10b981", "#3b82f6", "#eab308"];
    const pieces = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.8}s`,
    }));
    setConfetti(pieces);
    // Cleanup confetti after animation ends
    setTimeout(() => setConfetti([]), 3500);
  };

  // --- TOP UP ACTIONS ---
  const handleTopUpConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const selectedMethod = methods.find((m: any) => m.id === selectedMethodId);
    if (!selectedMethod) {
      toast.error("Please select a funding source");
      return;
    }

    setIsProcessingTopUp(true);

    if (selectedMethod.type === "mpesa") {
      setProcessingStep("stk-sent");
      setStkCountdown(5);
      // Start Countdown for M-Pesa push simulation
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = setInterval(() => {
        setStkCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            completeTopUp(amt, selectedMethod);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setProcessingStep("authenticating");
      setTimeout(() => {
        completeTopUp(amt, selectedMethod);
      }, 2500);
    }
  };

  const completeTopUp = (amountVal: number, methodObj: any) => {
    setBalance((prev) => prev + amountVal);
    const newTx = {
      id: `tx-${Date.now()}`,
      name: `Wallet top-up • ${methodObj.carrier || "Card"}`,
      date: "Just now",
      amount: amountVal,
      in: true,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setProcessingStep("success");
    triggerConfetti();
    toast.success(`Successfully loaded KES ${amountVal.toLocaleString()}!`);
  };

  const handleSimulatePin = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    const amt = parseFloat(topUpAmount);
    const selectedMethod = methods.find((m: any) => m.id === selectedMethodId);
    if (selectedMethod) {
      completeTopUp(amt, selectedMethod);
    }
  };

  const resetTopUpFlow = () => {
    setIsProcessingTopUp(false);
    setProcessingStep("none");
    setTopUpAmount("");
    setIsTopUpOpen(false);
  };

  // --- PAYMENT METHOD ACTIONS ---
  const handleAddMethod = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentTab === "mobile") {
      if (!mobilePhone || mobilePhone.trim().length < 9) {
        toast.error("Please enter a valid phone number");
        return;
      }
      // Formatting number snippet
      const lastDigits = mobilePhone.slice(-3);
      const newMethod = {
        id: `method-${Date.now()}`,
        type: "mpesa",
        label: `${mobileCarrier} • ••• ••• ${lastDigits}`,
        phone: mobilePhone,
        carrier: mobileCarrier,
        isDefault: methods.length === 0,
      };
      setMethods((prev: any) => [...prev, newMethod]);
      toast.success(`${mobileCarrier} account added successfully!`);
      // Reset form
      setMobilePhone("");
    } else {
      // Card validation
      const cleanedNum = cardNumber.replace(/\s+/g, "");
      if (cleanedNum.length < 15) {
        toast.error("Please enter a valid card number");
        return;
      }
      if (!cardName || cardName.trim().length < 3) {
        toast.error("Please enter the cardholder's name");
        return;
      }
      if (cardExpiry.length < 5) {
        toast.error("Please enter a valid expiry date (MM/YY)");
        return;
      }
      if (cardCvv.length < 3) {
        toast.error("Please enter a valid CVV");
        return;
      }

      const cardBrand = cleanedNum.startsWith("5") ? "Mastercard" : "Visa";
      const last4 = cleanedNum.slice(-4);
      const newMethod = {
        id: `method-${Date.now()}`,
        type: "card",
        label: `${cardBrand} •••• ${last4}`,
        number: `•••• •••• •••• ${last4}`,
        name: cardName.toUpperCase(),
        expiry: cardExpiry,
        isDefault: methods.length === 0,
      };

      setMethods((prev: any) => [...prev, newMethod]);
      toast.success(`${cardBrand} Card linked successfully!`);
      // Reset form
      setCardNumber("");
      setCardName("");
      setCardExpiry("");
      setCardCvv("");
    }

    setIsAddPaymentOpen(false);
  };

  const deleteMethod = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = methods.filter((m: any) => m.id !== id);
    setMethods(updated);
    toast.success("Payment method deleted");
  };

  const setDefaultMethod = (id: string) => {
    const updated = methods.map((m: any) => ({
      ...m,
      isDefault: m.id === id,
    }));
    setMethods(updated);
    toast.success("Default payment method updated");
  };

  // --- PROMO CODE ACTIONS ---
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();

    if (!code) {
      toast.error("Please enter a promo code");
      return;
    }

    // Check if code already applied
    if (promos.some((p: any) => p.code === code)) {
      toast.error("This promo code is already applied");
      return;
    }

    if (code === "WELCOME") {
      // WELCOME adds 300 to balance
      setBalance((prev) => prev + 300);
      const newPromo = { id: `promo-${Date.now()}`, code, label: "WELCOME applied • KES 300 added to wallet" };
      const newTx = { id: `tx-${Date.now()}`, name: "Promo code WELCOME", date: "Just now", amount: 300, in: true };
      setPromos((prev: any) => [...prev, newPromo]);
      setTransactions((prev) => [newTx, ...prev]);
      triggerConfetti();
      toast.success("Welcome promo applied! KES 300 added to your wallet.");
      setPromoInput("");
      setIsPromoOpen(false);
    } else if (code === "HERRIDE50") {
      // HERRIDE50 adds 50% discount banner
      const newPromo = { id: `promo-${Date.now()}`, code, label: "HERRIDE50 applied • 50% off next 3 rides" };
      setPromos((prev: any) => [...prev, newPromo]);
      triggerConfetti();
      toast.success("Promo HERRIDE50 applied successfully!");
      setPromoInput("");
      setIsPromoOpen(false);
    } else {
      toast.error("Invalid or expired promo code");
    }
  };

  // Helper to format card input
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  // Helper to format expiry input
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  return (
    <PhoneFrame>
      {/* Styles for custom flipping card preview and confetti fall */}
      <style>{`
        .perspective-container {
          perspective: 1000px;
        }
        .card-inner {
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .card-inner.flipped {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .card-back {
          transform: rotateY(180deg);
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
        }
        .confetti-piece {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: confetti-fall 2.5s ease-out forwards;
        }
      `}</style>

      {/* Confetti Overlay */}
      {confetti.length > 0 && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="confetti-piece"
              style={{
                backgroundColor: c.color,
                left: c.left,
                animationDelay: c.delay,
                top: 0,
              }}
            />
          ))}
        </div>
      )}

      <ScreenHeader title="Wallet" subtitle="Balance, cards & promos" back={false} />

      <div className="px-5 space-y-5">
        {/* Wallet Balance Card */}
        <div className="rounded-3xl bg-gradient-to-br from-pink-400 via-rose-500 to-rose-600 p-5 text-white glow-pink relative overflow-hidden">
          <div className="absolute right-0 top-0 size-24 bg-white/10 rounded-full blur-xl translate-x-1/3 -translate-y-1/3" />
          <p className="text-xs uppercase tracking-wider text-white/80">HerRide Balance</p>
          <p className="mt-2 text-4xl font-bold tracking-tight">KES {balance.toLocaleString()}</p>
          <p className="mt-1.5 text-xs text-white/85 flex items-center gap-1">
            <Sparkles className="size-3.5" /> + 320 saved this week with HerStudent
          </p>
          <div className="mt-5 flex gap-3 relative z-10">
            <button
              onClick={() => setIsTopUpOpen(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 py-2.5 text-xs font-semibold backdrop-blur transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="size-4" /> Top up
            </button>
            <button
              onClick={() => setIsPromoOpen(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/20 hover:bg-white/30 py-2.5 text-xs font-semibold backdrop-blur transition-all active:scale-[0.98] cursor-pointer"
            >
              <Tag className="size-4" /> Promo Code
            </button>
          </div>
        </div>

        {/* Payment Methods Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Payment Methods</h2>
            <button
              onClick={() => setIsAddPaymentOpen(true)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-0.5 cursor-pointer"
            >
              <Plus className="size-3.5" /> Add New
            </button>
          </div>

          {methods.length === 0 ? (
            <div className="glass rounded-2xl p-6 text-center space-y-2">
              <CreditCard className="size-8 text-muted-foreground/60 mx-auto" />
              <p className="text-xs text-muted-foreground">No payment methods added yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {methods.map((m: any) => (
                <div
                  key={m.id}
                  onClick={() => setDefaultMethod(m.id)}
                  className={`glass flex items-center gap-3 rounded-2xl px-4 py-3.5 cursor-pointer transition-all border ${
                    m.isDefault ? "border-rose-300 bg-rose-50/20" : "border-white/60 hover:border-rose-100"
                  }`}
                >
                  {m.type === "mpesa" ? (
                    <div className="size-8 rounded-xl bg-emerald-100 grid place-items-center">
                      <Smartphone className="size-4 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="size-8 rounded-xl bg-rose-100 grid place-items-center">
                      <CreditCard className="size-4 text-rose-600" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {m.type === "mpesa" ? m.carrier : "Card details saved"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {m.isDefault ? (
                      <span className="rounded-full bg-rose-100 border border-rose-200 px-2 py-0.5 text-[9px] font-bold text-rose-600 uppercase tracking-wide">
                        Default
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground hover:text-rose-500 font-medium">
                        Set Default
                      </span>
                    )}

                    <button
                      onClick={(e) => deleteMethod(m.id, e)}
                      className="size-7 rounded-lg hover:bg-rose-50 grid place-items-center text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete payment method"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promo Codes & Discounts */}
        {promos.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-foreground">Active Promotions</h2>
            <div className="space-y-2">
              {promos.map((p: any) => (
                <div key={p.id} className="glass border border-emerald-200/50 bg-emerald-50/5 flex items-center gap-3 rounded-2xl px-4 py-3">
                  <div className="size-8 rounded-xl bg-emerald-100 grid place-items-center">
                    <Tag className="size-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-emerald-800">{p.label}</p>
                  </div>
                  <button
                    onClick={() => {
                      setPromos(promos.filter((x: any) => x.id !== p.id));
                      toast.success("Promo code removed");
                    }}
                    className="text-muted-foreground hover:text-rose-500 cursor-pointer p-1"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto-Pay Option Settings */}
        <div className="glass rounded-2xl p-4.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-rose-500" /> Auto-Pay Fares
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Automatically settle ride fares at the end of a trip using your default payment method.
              </p>
            </div>
            <Switch
              checked={autoPay}
              onCheckedChange={(checked) => {
                if (checked && methods.length === 0) {
                  toast.error("Please add a payment method first to enable Auto-Pay");
                  return;
                }
                setAutoPay(checked);
                toast.success(checked ? "Auto-Pay is now active!" : "Auto-Pay has been disabled");
              }}
            />
          </div>

          {autoPay && methods.length > 0 && (
            <div className="mt-2 text-[10px] bg-rose-500/5 rounded-xl px-3 py-2 border border-rose-200/20 text-rose-700 flex items-center gap-1.5">
              <Info className="size-3.5 shrink-0" />
              <span>
                Saves time. Auto-paying with{" "}
                <strong>{methods.find((m: any) => m.isDefault)?.label.split("•")[0]}</strong>.
              </span>
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-foreground">Recent Activity</h2>
          <div className="glass divide-y divide-white/60 rounded-2xl overflow-hidden">
            {transactions.map((t: any) => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/20 transition-colors">
                <div
                  className={`grid size-9 place-items-center rounded-xl shrink-0 ${
                    t.in ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                  }`}
                >
                  {t.in ? <ArrowDownLeft className="size-4.5" /> : <ArrowUpRight className="size-4.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.date}</p>
                </div>
                <p className={`text-sm font-bold shrink-0 ${t.in ? "text-emerald-600" : "text-foreground"}`}>
                  {t.in ? "+" : "−"}KES {Math.abs(t.amount).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- INLINE SHEETS / BOTTOM SLIDERS --- */}

      {/* 1. TOP-UP BOTTOM SHEET */}
      {isTopUpOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white pb-6 pt-5 px-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[90%] overflow-y-auto">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Top Up Wallet</h3>
              <button
                onClick={resetTopUpFlow}
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* STK PUSH/CARD AUTH SIMULATION */}
            {isProcessingTopUp ? (
              <div className="py-8 text-center space-y-4">
                {processingStep === "stk-sent" && (
                  <div className="space-y-4 animate-pulse">
                    <div className="size-16 bg-emerald-100 text-emerald-600 rounded-full grid place-items-center mx-auto floaty">
                      <Smartphone className="size-8" />
                    </div>
                    <div className="space-y-1.5 px-4">
                      <h4 className="text-sm font-bold text-foreground">STK Push Sent</h4>
                      <p className="text-xs text-muted-foreground">
                        Please check your phone for M-Pesa push alert and enter your PIN.
                      </p>
                    </div>

                    {/* Simulation Mockup Push Pop-up */}
                    <div className="max-w-xs mx-auto border border-emerald-200 bg-emerald-50/90 rounded-2xl p-4 text-left shadow-lg space-y-3 mt-4">
                      <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Lipa Na M-Pesa</span>
                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-bold">SIMULATION</span>
                      </div>
                      <p className="text-xs text-emerald-900 leading-relaxed">
                        Do you want to pay KES {parseFloat(topUpAmount).toLocaleString()} to HerRide? Enter PIN to authorize.
                      </p>
                      <div className="flex gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                            setIsProcessingTopUp(false);
                            setProcessingStep("none");
                            toast.error("Transaction cancelled by user");
                          }}
                          className="flex-1 py-1.5 bg-white border border-emerald-200 hover:bg-emerald-50 text-[10px] font-bold text-emerald-800 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSimulatePin}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold text-white rounded-lg shadow-sm cursor-pointer text-center"
                        >
                          Authorize PIN ({stkCountdown}s)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {processingStep === "authenticating" && (
                  <div className="space-y-4">
                    <Loader2 className="size-12 text-rose-500 animate-spin mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-foreground">Processing Card Payment</h4>
                      <p className="text-xs text-muted-foreground">Securing transaction with 3D Secure...</p>
                    </div>
                  </div>
                )}

                {processingStep === "success" && (
                  <div className="space-y-6 pt-2">
                    <div className="size-16 bg-emerald-100 border border-emerald-200 text-emerald-600 rounded-full grid place-items-center mx-auto pulse-glow">
                      <Check className="size-8" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-foreground">Top-up Successful!</h4>
                      <p className="text-xs text-muted-foreground">
                        KES {parseFloat(topUpAmount).toLocaleString()} has been added to your wallet.
                      </p>
                    </div>
                    <button
                      onClick={resetTopUpFlow}
                      className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleTopUpConfirm} className="space-y-5">
                {/* Preset Amounts */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Select Amount (KES)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {["250", "500", "1000", "2000"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTopUpAmount(preset)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          topUpAmount === preset
                            ? "bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20"
                            : "bg-gray-50 border-gray-200 hover:border-rose-200 hover:bg-rose-50/10 text-foreground"
                        }`}
                      >
                        +{parseInt(preset, 10).toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Or Enter Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">KES</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-rose-300 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Funding Source Selector */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Select Funding Source
                  </label>
                  {methods.length === 0 ? (
                    <div className="border border-dashed border-gray-200 rounded-xl p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-2">No payment methods configured</p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTopUpOpen(false);
                          setIsAddPaymentOpen(true);
                        }}
                        className="text-xs font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        Add payment method
                      </button>
                    </div>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                      {methods.map((m: any) => (
                        <div
                          key={m.id}
                          onClick={() => setSelectedMethodId(m.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedMethodId === m.id
                              ? "border-rose-500 bg-rose-50/10"
                              : "border-gray-150 bg-gray-50/50 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="funding_source"
                            checked={selectedMethodId === m.id}
                            onChange={() => setSelectedMethodId(m.id)}
                            className="accent-rose-500"
                          />
                          {m.type === "mpesa" ? (
                            <Smartphone className="size-4 text-emerald-600" />
                          ) : (
                            <CreditCard className="size-4 text-rose-500" />
                          )}
                          <span className="text-xs font-semibold text-foreground flex-1 truncate">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={methods.length === 0 || !topUpAmount}
                  className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="size-4" /> Top Up KES {topUpAmount ? parseFloat(topUpAmount).toLocaleString() : "0"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. ADD PAYMENT METHOD BOTTOM SHEET */}
      {isAddPaymentOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white pb-6 pt-5 px-6 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[92%] overflow-y-auto">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Add Payment Method</h3>
              <button
                onClick={() => setIsAddPaymentOpen(false)}
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Sliding Tab Triggers */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => setPaymentTab("mobile")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  paymentTab === "mobile"
                    ? "bg-white text-rose-500 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mobile Money
              </button>
              <button
                type="button"
                onClick={() => setPaymentTab("card")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  paymentTab === "card"
                    ? "bg-white text-rose-500 shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Credit / Debit Card
              </button>
            </div>

            <form onSubmit={handleAddMethod} className="space-y-4">
              {paymentTab === "mobile" ? (
                /* MOBILE MONEY FORM */
                <div className="space-y-4">
                  {/* Carrier Select */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Mobile Operator
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["M-Pesa", "Airtel Money", "T-Kash"].map((carrier) => (
                        <button
                          key={carrier}
                          type="button"
                          onClick={() => setMobileCarrier(carrier)}
                          className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                            mobileCarrier === carrier
                              ? "bg-emerald-50 text-emerald-700 border-emerald-500 font-bold"
                              : "bg-gray-50 border-gray-200 hover:border-gray-300 text-foreground"
                          }`}
                        >
                          {carrier}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Mobile Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                        +254
                      </span>
                      <input
                        type="tel"
                        placeholder="712 345 678"
                        maxLength={12}
                        value={mobilePhone}
                        onChange={(e) => setMobilePhone(e.target.value.replace(/[^0-9]/g, ""))}
                        className="w-full pl-14 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-rose-300 focus:bg-white rounded-xl text-sm font-semibold outline-none transition-all"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1">
                      <AlertCircle className="size-3.5 text-rose-500 shrink-0 mt-0.5" />
                      We will send an STK push payment request to this phone number whenever you choose M-Pesa.
                    </p>
                  </div>
                </div>
              ) : (
                /* CREDIT CARD FORM */
                <div className="space-y-4">
                  {/* Card Visual Preview */}
                  <div className="perspective-container w-full h-36 mb-4">
                    <div className={`card-inner w-full h-full relative rounded-2xl shadow-xl duration-500 ${isCardFlipped ? "flipped" : ""}`}>
                      {/* Front of Card */}
                      <div className="card-front w-full h-full rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-4 text-white flex flex-col justify-between overflow-hidden border border-white/10">
                        {/* Highlights */}
                        <div className="absolute right-0 top-0 size-24 bg-white/5 rounded-full blur-xl translate-x-1/3 -translate-y-1/3" />
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="size-2 rounded-full bg-rose-500" />
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-rose-400">HerRide Pay</span>
                          </div>
                          {/* Brand Logo */}
                          <span className="text-[11px] font-black italic tracking-tight bg-white/15 px-2 py-0.5 rounded">
                            {cardNumber.replace(/\s+/g, "").startsWith("5") ? "Mastercard" : "Visa"}
                          </span>
                        </div>
                        {/* Metallic chip */}
                        <div className="w-8 h-6 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-md opacity-80" />
                        {/* Card Number */}
                        <p className="text-base font-bold tracking-widest font-mono text-center">
                          {cardNumber || "•••• •••• •••• ••••"}
                        </p>
                        {/* Name and Expiry */}
                        <div className="flex justify-between items-end text-[10px] font-mono text-white/80">
                          <div>
                            <p className="text-[8px] text-white/40 uppercase">Cardholder</p>
                            <p className="font-semibold uppercase tracking-wider truncate max-w-40">{cardName || "JANE DOE"}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] text-white/40 uppercase">Expires</p>
                            <p className="font-semibold">{cardExpiry || "MM/YY"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Back of Card */}
                      <div className="card-back w-full h-full rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 py-4 text-white flex flex-col justify-between overflow-hidden border border-white/10">
                        {/* Magnetic Strip */}
                        <div className="w-full h-8 bg-black/90 mt-1" />
                        {/* Signature block with CVV */}
                        <div className="px-4 space-y-1.5">
                          <p className="text-[7px] text-white/30 uppercase tracking-widest text-right mr-10">Authorized Signature</p>
                          <div className="flex items-center bg-gray-100 rounded-sm">
                            <div className="flex-1 h-6 bg-gray-200/80 diagonal-stripes" />
                            <div className="bg-white text-black font-semibold font-mono text-xs px-2 py-0.5 rounded-r-sm h-6 flex items-center">
                              {cardCvv || "•••"}
                            </div>
                          </div>
                        </div>
                        <p className="text-[8px] font-mono text-white/30 text-center">
                          HerRide Secure Payments • SSL Encrypted
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-3.5">
                    {/* Card Number input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Card Number</label>
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        maxLength={19}
                        value={cardNumber}
                        onFocus={() => setIsCardFlipped(false)}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-rose-300 focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all font-mono"
                      />
                    </div>

                    {/* Cardholder name input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={cardName}
                        onFocus={() => setIsCardFlipped(false)}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-rose-300 focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all uppercase"
                      />
                    </div>

                    {/* Expiry and CVV inline */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardExpiry}
                          onFocus={() => setIsCardFlipped(false)}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-rose-300 focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all font-mono text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">CVV</label>
                        <input
                          type="password"
                          placeholder="•••"
                          maxLength={3}
                          value={cardCvv}
                          onFocus={() => setIsCardFlipped(true)}
                          onBlur={() => setIsCardFlipped(false)}
                          onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ""))}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 focus:border-rose-300 focus:bg-white rounded-xl text-xs font-semibold outline-none transition-all font-mono text-center"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer mt-4"
              >
                Save Payment Method
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. PROMO CODE BOTTOM SHEET */}
      {isPromoOpen && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-30 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white pb-6 pt-5 px-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Apply Promo Code</h3>
              <button
                onClick={() => setIsPromoOpen(false)}
                className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 grid place-items-center text-muted-foreground transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleApplyPromo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Promo Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. HERRIDE50"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-rose-300 focus:bg-white rounded-xl text-sm font-semibold uppercase tracking-wider outline-none transition-all text-center"
                />
              </div>

              <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest block">Available Demo Codes:</span>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-gray-100">
                    <span className="font-bold text-foreground font-mono">WELCOME</span>
                    <span>Adds KES 300 to balance</span>
                  </li>
                  <li className="flex justify-between items-center bg-white px-2.5 py-1.5 rounded-lg border border-gray-100">
                    <span className="font-bold text-foreground font-mono">HERRIDE50</span>
                    <span>50% off next 3 rides</span>
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Tag className="size-4" /> Apply Code
              </button>
            </form>
          </div>
        </div>
      )}

      <BottomNav />
    </PhoneFrame>
  );
}
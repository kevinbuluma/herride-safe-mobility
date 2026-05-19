import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, Fingerprint } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <PhoneFrame bare>
      <div className="flex min-h-dvh flex-col px-6 pb-10 pt-10">
        <Logo size={48} />
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Welcome to HerRide</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ride Secure. Ride HerRide.
        </p>

        <div className="mt-8 space-y-3">
          <label className="text-xs font-medium text-muted-foreground">Phone number</label>
          <div className="glass flex items-center gap-2 rounded-2xl px-4">
            <span className="text-sm font-medium">🇰🇪 +254</span>
            <Input
              type="tel"
              placeholder="712 345 678"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>

          <Button asChild size="lg" className="h-14 w-full rounded-2xl bg-rose-500 text-base hover:bg-rose-600 glow-pink">
            <Link to="/home">
              <Phone className="mr-2 size-4" /> Continue with phone
            </Link>
          </Button>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or continue with <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button asChild variant="outline" className="h-12 rounded-2xl">
              <Link to="/home"><Mail className="size-4" /></Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-2xl">
              <Link to="/home">G</Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-2xl">
              <Link to="/home"><Fingerprint className="size-4" /></Link>
            </Button>
          </div>
        </div>

        <p className="mt-auto text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms & Safety Charter.
        </p>
      </div>
    </PhoneFrame>
  );
}
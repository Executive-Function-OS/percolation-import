"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2 } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // Simulate API call
    setTimeout(() => {
      console.log("Subscribed:", email);
      setStatus("success");
      setEmail("");
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm text-center">
      <div className="mx-auto w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4">
        <Mail className="w-6 h-6 text-brand-blue" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Join the EFOS Research Network
      </h3>
      <p className="text-slate-500 mb-6 text-sm">
        Subscribe to receive monthly updates on methodology developments,
        publication announcements, and new tool features.
      </p>

      {status === "success" ? (
        <div className="flex items-center justify-center gap-2 text-brand-teal bg-emerald-50 py-3 rounded-xl border border-emerald-100">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium text-sm">Thanks for subscribing!</span>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email address"
            className="rounded-xl flex-1 focus-visible:ring-brand-blue"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            required
          />
          <Button
            type="submit"
            className="rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white transition-all"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      )}
    </div>
  );
}

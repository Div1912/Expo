"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Send, Loader2, CheckCircle2, XCircle, ArrowRight, ExternalLink, Zap, Shield, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

function SendForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [recipient, setRecipient] = useState(searchParams.get("to") || "");
  const [amount, setAmount] = useState(searchParams.get("amount") || "");
  const [note, setNote] = useState(searchParams.get("note") || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "resolving" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/payments/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, amount, note }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setStatus("error");
      } else {
        setTxHash(data.tx_hash);
        setStatus("success");
      }
    } catch (err) {
      setError("Failed to process payment");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="text-center py-10 glass-card relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500" />
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-green-500 rounded-full"
          />
        </motion.div>

        <h2 className="text-4xl font-black tracking-tight mb-4 uppercase">PAYMENT SENT</h2>
        <p className="text-zinc-400 mb-8 text-lg">
          Successfully routed <span className="text-white font-black">{amount} USDC</span> to <span className="text-white font-black">{recipient}</span>
        </p>
        
        <div className="space-y-4">
          <motion.a 
            whileHover={{ scale: 1.02 }}
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-zinc-500 hover:text-blue-400 transition-all font-bold text-sm bg-white/5 py-4 rounded-xl border border-white/5"
          >
            VIEW ON EXPLORER <ExternalLink className="w-4 h-4" />
          </motion.a>
          <Button 
            onClick={() => router.push("/dashboard")}
            className="w-full h-16 bg-white text-black hover:bg-zinc-200 text-xl font-black rounded-2xl shadow-2xl transition-all active:scale-95"
          >
            RETURN TO OVERVIEW
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 uppercase leading-none">
          SEND MONEY
        </h1>
        <p className="text-zinc-500 font-medium text-lg">Global settlement via universal routing</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden"
      >
        <form onSubmit={handleSend} className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Universal Identity</label>
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="username@expo"
                className="bg-white/5 border-white/10 pl-14 h-16 text-xl font-bold rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all tracking-tight"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Payment Amount</label>
            <div className="relative group">
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-white/5 border-white/10 h-20 text-4xl font-black pr-24 rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all tracking-tighter"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-xl uppercase tracking-widest select-none group-focus-within:text-blue-500 transition-colors">
                USDC
              </div>
            </div>
            <div className="flex items-center gap-2 px-1">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Near-zero Network Fee Applied</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Transfer Note</label>
            <Input
              placeholder="What's this for?"
              className="bg-white/5 border-white/10 h-14 text-lg font-bold px-6 rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2 text-center">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 leading-none">Secured</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2 text-center">
              <Globe className="w-5 h-5 text-purple-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 leading-none">Global</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col items-center gap-2 text-center">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 leading-none">Instant</span>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold uppercase tracking-tight"
            >
              <XCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <Button 
            type="submit" 
            disabled={loading || !recipient || !amount} 
            className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-black rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/30 disabled:opacity-50 group"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="w-7 h-7 animate-spin" /> ROUTING...
              </span>
            ) : (
              <span className="flex items-center gap-2 uppercase">
                SEND USDC <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}

export default function SendPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          <p className="text-zinc-500 font-black text-xs uppercase tracking-widest">Initializing Route</p>
        </div>
      }>
        <SendForm />
      </Suspense>
    </div>
  );
}

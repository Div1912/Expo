"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Share2, Info, Loader2, Sparkles, QrCode } from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";

export default function ReceivePage() {
  const [profile, setProfile] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/expo/profile")
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      });
  }, []);

  const qrData = JSON.stringify({
    expo: profile?.universal_id ? `${profile.universal_id}@expo` : "",
    network: "stellar-testnet",
    type: "payment",
    amount: amount || undefined,
    currency: "USDC",
    note: note || undefined
  });

  const handleCopy = async () => {
    if (profile?.universal_id) {
      const success = await copyToClipboard(`${profile.universal_id}@expo`);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-zinc-500 font-black tracking-widest uppercase text-xs animate-pulse">Generating Secure QR</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-12 pb-20">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 uppercase leading-none">
          RECEIVE
        </h1>
        <p className="text-zinc-500 font-medium text-lg">Your universal gateway to global payments</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative group"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative glass-card p-6 md:p-14 rounded-[2.5rem] flex flex-col items-center gap-10">
          <div className="relative p-4 md:p-6 bg-white rounded-3xl shadow-2xl border-4 border-zinc-100/50">
            <QRCodeSVG 
              value={qrData} 
              size={220}
              level="H"
              includeMargin={false}
              className="relative z-10 w-full h-auto max-w-[260px]"
            />
            <div className="absolute inset-0 bg-blue-500/5 blur-xl -z-10" />
          </div>

          <div className="text-center space-y-3 w-full px-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Universal EXPO ID</p>
            <h3 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase break-all">{profile?.universal_id}@expo</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              onClick={handleCopy} 
              className="flex-1 h-16 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl gap-3 transition-all hover:scale-105 active:scale-95"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="check" className="flex items-center gap-2">
                    <Check className="w-6 h-6" /> COPIED
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="copy" className="flex items-center gap-2">
                    <Copy className="w-5 h-5" /> COPY IDENTITY
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
            <Button variant="outline" className="h-16 px-6 border-white/10 hover:bg-white/5 rounded-2xl transition-all hover:scale-105 active:scale-95">
              <Share2 className="w-6 h-6 text-zinc-400 group-hover:text-white" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="glass-card p-8 rounded-[2rem] space-y-6">
        <div className="flex items-center gap-3 text-blue-500">
          <Sparkles className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-[0.2em]">Payment Request Settings</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Pre-filled Amount (USDC)</label>
            <div className="relative">
              <Input 
                type="number" 
                placeholder="0.00"
                className="bg-white/5 border-white/10 h-14 text-xl font-black pl-5 rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-sm uppercase">USDC</div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Optional Note</label>
            <Input 
              placeholder="e.g. Dinner, Rent"
              className="bg-white/5 border-white/10 h-14 text-lg font-bold pl-5 rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
          <Info className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] font-medium text-zinc-500 leading-relaxed uppercase tracking-wider">
            Settlement is processed on the Stellar network. Real USDC asset verification is active. This QR follows the universal EXPO protocol.
          </p>
        </div>
      </div>
    </div>
  );
}

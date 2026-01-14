"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Background } from "@/components/Background";
import { Navbar } from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Shield, ArrowRight, ExternalLink, Sparkles, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");
  const router = useRouter();

    useEffect(() => {
      async function checkExisting() {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("universal_id")
              .eq("id", user.id)
              .maybeSingle();
            
            if (profile?.universal_id) {
              router.push("/dashboard");
            }
          }
        } catch (err) {
          console.error("Check existing profile error:", err);
        }
      }
      checkExisting();
    }, [router]);

    useEffect(() => {

    if (username.length < 3) {
      setIsAvailable(null);
      return;
    }

    const timer = setTimeout(async () => {
        setChecking(true);
        try {
          const res = await fetch(`/api/expo/check?username=${username}`);
          const data = await res.json();
          setIsAvailable(data.available);
        } catch (err) {
          console.error(err);
        } finally {
          setChecking(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    }, [username]);

    const handleClaim = async () => {
      setClaiming(true);
      setError("");
      try {
        const res = await fetch("/api/expo/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setTxHash(data.tx_hash);
        setSuccess(true);
      }
    } catch (err) {
      setError("Failed to claim Universal ID");
    } finally {
      setClaiming(false);
    }
  };

  if (success) {
    return (
      <div className="relative min-h-screen text-white flex items-center justify-center p-4">
        <Background />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
          className="max-w-md w-full glass-card text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative"
          >
            <Check className="w-12 h-12 text-blue-500" />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-blue-500 rounded-full"
            />
          </motion.div>

          <h2 className="text-4xl font-black tracking-tight mb-4">IDENTITY CLAIMED</h2>
          <p className="text-zinc-400 mb-8 text-lg">
            Your universal identity <span className="text-white font-black">{username}@expo</span> is now secured on the Stellar network.
          </p>
          
          <div className="space-y-4">
            <motion.a 
              whileHover={{ scale: 1.02 }}
              href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-zinc-500 hover:text-blue-400 transition-all font-bold text-sm bg-white/5 py-3 rounded-xl border border-white/5"
            >
              VIEW ON EXPLORER <ExternalLink className="w-4 h-4" />
            </motion.a>
            <Button 
              onClick={() => router.push("/dashboard")}
              className="w-full h-16 bg-white text-black hover:bg-zinc-200 text-xl font-black rounded-2xl shadow-2xl"
            >
              CONTINUE TO DASHBOARD <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white">
      <Background />
      <Navbar />

      <main className="container mx-auto px-4 pt-40 pb-20 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-xl glass-card relative overflow-hidden"
        >
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-3">CLAIM YOUR IDENTITY</h2>
            <p className="text-zinc-400 text-lg font-medium">One ID for the entire global economy.</p>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Universal Username</label>
              <div className="relative group">
                <Input
                  placeholder="yourname"
                  className="bg-white/5 border-white/10 h-16 text-2xl font-black pr-24 rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all tracking-tight"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-xl select-none group-focus-within:text-blue-500/50 transition-colors">
                  @expo
                </div>
              </div>
              
              <div className="h-6 mt-2 px-1">
                <AnimatePresence mode="wait">
                  {checking ? (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="text-xs font-bold text-zinc-500 flex items-center gap-2"
                    >
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> VERIFYING AVAILABILITY...
                    </motion.p>
                  ) : isAvailable === true ? (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="text-xs font-bold text-green-500 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" /> IDENTITY IS AVAILABLE
                    </motion.p>
                  ) : isAvailable === false ? (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0 }}
                      className="text-xs font-bold text-red-500 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" /> IDENTITY ALREADY CLAIMED
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-sm">
              <p className="flex gap-4 items-start text-zinc-400 font-medium leading-relaxed">
                <Shield className="w-6 h-6 text-blue-500 flex-shrink-0" />
                Your identity will be anchored to the Soroban smart contract. This provides immutable proof of ownership and facilitates instant routing.
              </p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold"
              >
                {error}
              </motion.div>
            )}

            <Button 
              disabled={!isAvailable || claiming || checking}
              onClick={handleClaim}
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-xl font-black rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-blue-600/20 disabled:opacity-50 disabled:hover:scale-100"
            >
              {claiming ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" /> SECURING IDENTITY...
                </span>
              ) : "CLAIM UNIVERSAL ID"}
            </Button>

            <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
              3-20 characters • Alphanumeric + underscores
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ArrowUpRight, ArrowDownLeft, QrCode, Scan, History, Loader2, ExternalLink, Zap, Shield, Globe, Wallet, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "@/lib/clipboard";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [balances, setBalances] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        const [profileRes, balanceRes, historyRes] = await Promise.allSettled([
          fetch("/api/expo/profile"),
          fetch("/api/expo/balance"),
          fetch("/api/payments/history"),
        ]);

        if (!mounted) return;

        if (profileRes.status === 'fulfilled' && profileRes.value.ok) {
          const profileData = await profileRes.value.json();
          setProfile(profileData);
          if (!profileData.universal_id) {
            router.push("/onboarding");
            return;
          }
        } else if (profileRes.status === 'fulfilled' && profileRes.value.status === 404) {
          router.push("/onboarding");
          return;
        } else if (profileRes.status === 'fulfilled' && profileRes.value.status === 401) {
          router.push("/auth/login");
          return;
        }

        if (balanceRes.status === 'fulfilled' && balanceRes.value.ok) {
          const balanceData = await balanceRes.value.json();
          setBalances(balanceData.balances || []);
        }

        if (historyRes.status === 'fulfilled' && historyRes.value.ok) {
          const historyData = await historyRes.value.json();
          setTransactions(historyData.slice(0, 5) || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();
    return () => { mounted = false; };
  }, [router]);

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
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <div className="absolute inset-0 blur-lg bg-blue-500/20 rounded-full" />
        </div>
        <p className="text-zinc-500 font-black tracking-widest uppercase text-xs animate-pulse">Syncing with Stellar Network</p>
      </div>
    );
  }

  const usdcBalance = balances.find(b => b.asset === 'USDC' || b.asset === 'XLM')?.balance || "0.00";

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-[clamp(2.5rem,8vw,5rem)] font-black tracking-tight mb-4 uppercase leading-[0.9] break-words overflow-wrap-anywhere">
            OVERVIEW
          </h1>
          <div 
            onClick={handleCopy}
            className="group flex items-center gap-3 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl w-fit cursor-pointer hover:bg-white/10 transition-all hover:scale-105 active:scale-95 shadow-xl max-w-full"
          >
            <span className="text-blue-500 font-black text-sm md:text-lg tracking-tight truncate max-w-[200px] md:max-w-none">{profile?.universal_id}@expo</span>
            <div className="h-4 w-[1px] bg-white/10" />
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="check">
                  <Check className="w-4 h-4 text-green-500" />
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="copy">
                  <Copy className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Network Status</span>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,1)] animate-pulse" />
              <span className="text-sm font-bold uppercase tracking-tight">STELLAR TESTNET</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Balance Card */}
      <section>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-25 transition-opacity duration-500" />
            <div className="relative glass-card p-6 md:p-14 rounded-[2.5rem] overflow-hidden">
              {/* Abstract Background Shapes - Simple Opacity */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
                <div className="space-y-4 min-w-0 flex-1">
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-blue-500">Available USDC</p>
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <h2 className="text-[clamp(2.5rem,10vw,6rem)] font-black tracking-tighter leading-none break-all">
                      {usdcBalance}
                    </h2>
                    <span className="text-xl md:text-3xl font-black text-zinc-600 tracking-widest shrink-0">USDC</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 shrink-0">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Instant Settlement</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 shrink-0">
                      <Shield className="w-3 h-3 text-blue-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">On-Chain Secured</span>
                    </div>
                  </div>
                </div>
  
                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full lg:w-auto lg:min-w-[280px]">
                  <Link href="/dashboard/send" className="flex-1">
                    <Button className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-3xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-600/30 group">
                      SEND <ArrowUpRight className="ml-2 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/dashboard/receive" className="flex-1">
                    <Button className="w-full h-20 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xl rounded-3xl transition-all hover:scale-105 active:scale-95 backdrop-blur-xl group">
                      RECEIVE <ArrowDownLeft className="ml-2 w-6 h-6 group-hover:-translate-x-1 group-hover:translate-y-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
        </motion.div>
      </section>

      {/* Grid Layout for History and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-black tracking-tight uppercase">RECENT ACTIVITY</h3>
            <Link href="/dashboard/history" className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
              View all <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="p-12 glass-card rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4 opacity-50 border-dashed">
                <History className="w-10 h-10 text-zinc-600" />
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-600">No transactions yet</p>
              </div>
            ) : (
              transactions.map((tx, idx) => {
                const isReceived = tx.recipient_id === profile?.id;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={tx.id}
                    className="group glass-card p-5 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                        isReceived ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      )}>
                        {isReceived ? <ArrowDownLeft className="w-7 h-7" /> : <ArrowUpRight className="w-7 h-7" />}
                      </div>
                      <div>
                        <p className="font-black text-lg tracking-tight uppercase">
                          {isReceived ? (tx.sender_universal_id || 'UNKNOWN') : (tx.recipient_universal_id || 'UNKNOWN')}
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          {format(new Date(tx.created_at), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className={cn("text-xl font-black tracking-tight", isReceived ? "text-green-500" : "text-white")}>
                          {isReceived ? "+" : "-"}{tx.amount} <span className="text-[10px] text-zinc-500 uppercase">USDC</span>
                        </p>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                          {tx.status}
                        </p>
                      </div>
                      <a 
                        href={`https://stellar.expert/explorer/testnet/tx/${tx.tx_hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-4 h-4 text-zinc-500" />
                      </a>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </section>

        {/* Sidebar Actions */}
        <section className="space-y-6">
          <h3 className="text-2xl font-black tracking-tight uppercase px-2">QUICK ACTIONS</h3>
          <div className="grid grid-cols-1 gap-4">
            <QuickActionCard 
              href="/dashboard/scan"
              icon={<Scan className="w-6 h-6" />}
              title="SCAN TO PAY"
              description="Quickly settle using a QR code"
              color="blue"
            />
            <QuickActionCard 
              href="/dashboard/receive"
              icon={<QrCode className="w-6 h-6" />}
              title="MY IDENTITY"
              description="Show your Universal QR"
              color="purple"
            />
            <QuickActionCard 
              href="/dashboard/profile"
              icon={<Wallet className="w-6 h-6" />}
              title="WALLET SECURITY"
              description="Manage your keys and backup"
              color="zinc"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function QuickActionCard({ href, icon, title, description, color }: any) {
  const colors: any = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    zinc: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20"
  };

  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ scale: 1.02, x: 5 }}
        whileActive={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        className="glass-card p-6 rounded-[2rem] flex items-center gap-5 group hover:bg-white/10 transition-all"
      >
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110", colors[color])}>
          {icon}
        </div>
        <div>
          <h4 className="font-black tracking-tight uppercase">{title}</h4>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
}

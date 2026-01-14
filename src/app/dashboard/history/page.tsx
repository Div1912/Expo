"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, ExternalLink, Search, Loader2, Filter, History, Calendar, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
          const [profileRes, historyRes] = await Promise.all([
            fetch("/api/expo/profile"),
            fetch("/api/payments/history"),
          ]);
        const profileData = await profileRes.json();
        const historyData = await historyRes.json();
        
        setProfile(profileData);
        setTransactions(historyData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredTransactions = transactions.filter(tx => 
    tx.sender_universal_id?.toLowerCase().includes(search.toLowerCase()) ||
    tx.recipient_universal_id?.toLowerCase().includes(search.toLowerCase()) ||
    tx.amount.toString().includes(search)
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        <p className="text-zinc-500 font-black tracking-widest uppercase text-xs animate-pulse">Retrieving Ledger History</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 uppercase leading-none">
            HISTORY
          </h1>
          <p className="text-zinc-500 font-medium text-lg">Immutable proof of global transactions</p>
        </div>
        
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
          <Input 
            placeholder="Search routing history..." 
            className="pl-14 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-blue-500/50 transition-all font-bold tracking-tight"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32 glass-card rounded-[2.5rem] border-dashed flex flex-col items-center gap-6"
            >
              <History className="w-16 h-16 text-zinc-800" />
              <div className="space-y-1">
                <p className="text-xl font-black uppercase tracking-tight text-zinc-600">No records found</p>
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-800">Initiate a payment to see it here</p>
              </div>
            </motion.div>
          ) : (
            filteredTransactions.map((tx, index) => {
              const isReceived = tx.recipient_id === profile?.id;
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="group glass-card p-6 md:p-8 rounded-[2rem] flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center gap-6 md:gap-8 relative z-10">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-transform group-hover:scale-110",
                      isReceived ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]" : "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.1)]"
                    )}>
                      {isReceived ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-black text-xl md:text-2xl tracking-tighter uppercase leading-none">
                          {isReceived ? (tx.sender_universal_id || 'EXTERNAL') : (tx.recipient_universal_id || 'EXTERNAL')}
                        </span>
                        <div className="h-1 w-1 bg-zinc-700 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                          @expo
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {format(new Date(tx.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Globe className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {tx.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 md:gap-8 relative z-10 min-w-0">
                    <div className="text-right shrink-0">
                      <p className={cn("text-2xl md:text-3xl font-black tracking-tighter leading-none mb-1 break-all", isReceived ? "text-green-500" : "text-white")}>
                        {isReceived ? "+" : "-"}{tx.amount} <span className="text-xs text-zinc-500 uppercase tracking-widest shrink-0">USDC</span>
                      </p>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-black">
                        Confirmed on Ledger
                      </p>
                    </div>
                    <motion.a 
                      whileHover={{ scale: 1.1 }}
                      whileActive={{ scale: 0.9 }}
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.tx_hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 bg-white/5 rounded-2xl hover:bg-white/20 text-zinc-500 hover:text-white transition-all shadow-xl border border-white/5"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </motion.a>
                  </div>

                  {/* Hover Highlight Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/0 to-blue-500/0 group-hover:via-blue-500/5 transition-all duration-500" />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

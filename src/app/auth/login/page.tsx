"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Background } from "@/components/Background";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Chrome, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !password) return;
      
      setLoading(true);
      setError("");
  
      try {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (loginError) {
          setError(loginError.message);
          setLoading(false);
          return;
        }
  
        if (data.user) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("universal_id")
            .eq("id", data.user.id)
            .maybeSingle();
  
          if (profileError) {
            console.error("Profile fetch error:", profileError);
            // Even if profile fetch fails, we can try to go to dashboard
            // or onboarding based on whether we think it's a fatal error.
            // For now, let's assume if it fails, we should try onboarding.
            router.push("/onboarding");
            return;
          }

          if (profile?.universal_id) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
        }
      } catch (err: any) {
        console.error("Login error:", err);
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    };

  return (
    <div className="relative min-h-screen text-white selection:bg-blue-500/30">
      <Background />
      <Navbar />

      <main className="container mx-auto px-4 pt-40 pb-20 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md glass-card"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tight mb-2">WELCOME BACK</h2>
            <p className="text-zinc-400 font-medium">Log in to your EXPO account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                <Link href="#" className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }}
                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-600/20">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <span className="flex items-center gap-2">
                  LOG IN <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="bg-[#0c0c0c] px-4 text-zinc-600">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-14 border-white/10 hover:bg-white/5 rounded-2xl gap-3 font-bold transition-all active:scale-[0.98]">
            <Chrome className="w-5 h-5" /> Google
          </Button>

          <p className="mt-10 text-center text-zinc-500 font-medium">
            New to EXPO?{" "}
            <Link href="/auth/signup" className="text-blue-500 font-black hover:text-blue-400 transition-colors">SIGN UP</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}

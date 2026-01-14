"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Background } from "@/components/Background";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Chrome, Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwordStrength < 2) {
      setError("Please use a stronger password");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      // Create initial profile row
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email
        });
      }
      router.push("/onboarding");
    }
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-blue-500/30">
      <Background />
      <Navbar />

      <main className="container mx-auto px-4 pt-32 pb-20 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md glass-card mt-10"
        >
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tight mb-2 uppercase">JOIN EXPO</h2>
            <p className="text-zinc-400 font-medium">Create your universal payment identity</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
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
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Secure Password</label>
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
              <div className="flex gap-1.5 h-1 px-1 mt-3">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      i < passwordStrength 
                        ? (passwordStrength <= 2 ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]') 
                        : 'bg-white/5'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Confirm Identity</label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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

            <Button type="submit" disabled={loading} className="w-full h-14 bg-white text-black hover:bg-zinc-200 font-black text-lg rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <span className="flex items-center gap-2 uppercase tracking-tight">
                  Create Account <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="bg-[#0c0c0c] px-4 text-zinc-600">Or use social</span>
            </div>
          </div>

          <Button variant="outline" className="w-full h-14 border-white/10 hover:bg-white/5 rounded-2xl gap-3 font-bold transition-all active:scale-[0.98]">
            <Chrome className="w-5 h-5" /> Google
          </Button>

          <p className="mt-10 text-center text-zinc-500 font-medium">
            Already have an ID?{" "}
            <Link href="/auth/login" className="text-blue-500 font-black hover:text-blue-400 transition-colors">LOG IN</Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}

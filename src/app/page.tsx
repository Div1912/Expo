"use client";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Background } from "@/components/Background";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="relative min-h-screen text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Background />
      <Navbar />

      {/* Hero Section - Maximum Performance */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center z-10">
          <div>
            <p className="text-blue-500 uppercase text-[10px] md:text-xs font-bold mb-6 tracking-[0.4em]">
              STELLAR NETWORK
            </p>
            <h1 className="text-[clamp(2.5rem,10vw,8rem)] font-black tracking-tighter mb-8 leading-[0.85] select-none break-words">
              GLOBAL <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600">
                PAYMENT
              </span> <br />
              <span className="relative inline-flex gap-[0.05em] text-blue-500">
                {"ROUTER".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 40, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      ease: [0.215, 0.61, 0.355, 1.0],
                    }}
                    className="inline-block origin-bottom"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed px-4">
              Register one ID. Send money globally. <span className="text-white font-bold">Settling on Stellar.</span><br />
              Zero complexity, absolute speed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-transform active:scale-95 shadow-xl shadow-blue-500/10">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg border-white/10 hover:bg-white/5 rounded-full transition-transform active:scale-95 backdrop-blur-sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Element for Aesthetic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
           <div className="absolute top-[20%] left-[10%] w-32 h-32 bg-blue-500 blur-[120px] rounded-full animate-pulse" />
           <div className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-indigo-500 blur-[120px] rounded-full animate-pulse" />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-20 py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-blue-400" />}
            title="Non-Custodial"
            description="Your assets are anchored on-chain. We route the logic, you control the wealth."
            delay={0}
          />
          <FeatureCard 
            icon={<Globe className="w-6 h-6 text-indigo-400" />}
            title="Universal ID"
            description="Replace long addresses with username@expo. The human way to pay anyone."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-blue-500" />}
            title="Stellar Speed"
            description="Finality in 3-5 seconds. Costs a fraction of a cent. Global by default."
            delay={0.2}
          />
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-20 border-t border-white/5 opacity-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-zinc-500 mb-8">Settling On</p>
          <div className="flex justify-center items-center gap-12 grayscale brightness-200">
            <span className="text-xl font-bold italic opacity-40">STELLAR</span>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-8 left-4 right-4 z-50">
        <Link href="/auth/signup">
          <Button className="w-full h-14 bg-white text-black hover:bg-zinc-200 text-lg font-bold rounded-2xl shadow-2xl transition-transform active:scale-95">
            Claim Your EXPO ID
          </Button>
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 overflow-hidden"
    >
      <div className="relative z-10">
        <div className="mb-6 p-3 bg-blue-500/10 rounded-xl w-fit group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
        <p className="text-zinc-400 text-base leading-relaxed">{description}</p>
      </div>
      
      {/* Aesthetic Border Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

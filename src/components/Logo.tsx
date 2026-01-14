"use client";

import { motion } from "framer-motion";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-blue-600 rounded-lg rotate-45 animate-in fade-in zoom-in duration-500" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-2xl tracking-tighter transform -rotate-45">X</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-black tracking-tighter text-white leading-none">EXPO</span>
        <span className="text-[8px] font-bold tracking-[0.4em] text-blue-500/80 uppercase mt-1">
          Global Payment Router
        </span>
      </div>
    </div>
  );
}

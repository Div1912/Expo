"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Background() {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<{ width: string, height: string, left: string, top: string, opacity: number }[]>([]);

    useEffect(() => {
    setMounted(true);
    const newStars = [...Array(100)].map(() => ({
      width: Math.random() * 2 + 1 + 'px',
      height: Math.random() * 2 + 1 + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      opacity: Math.random() * 0.7 + 0.3,
      duration: Math.random() * 3 + 2,
    }));
    setStars(newStars);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-black -z-10" />;

  return (
    <div className="fixed inset-0 bg-[#020202] -z-10 overflow-hidden pointer-events-none select-none">
      {/* Noise Overlay */}
      <div className="noise opacity-[0.03]" />

      {/* Primary Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#05051a_0%,#000000_100%)]" />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.1]" 
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

        {/* Global Animated Glows */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.3, 0.15],
              x: [0, 50, 0],
              y: [0, 25, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/30 blur-[120px] rounded-full" 
          />
          <motion.div 
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.15, 0.25, 0.15],
              x: [0, -50, 0],
              y: [0, -25, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-500/30 blur-[120px] rounded-full" 
          />
        </div>

        {/* Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

        {/* Simple stars - Moved after Bottom Fade for visibility */}
        <div className="absolute inset-0 z-0">
          {stars.map((star, i) => (
            <motion.div
              key={i}
              animate={{ 
                opacity: [star.opacity, star.opacity * 0.3, star.opacity],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: star.duration, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)]"
              style={{
                width: star.width,
                height: star.height,
                left: star.left,
                top: star.top,
              }}
            />
          ))}
        </div>
    </div>
  );
}


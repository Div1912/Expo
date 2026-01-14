"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Background() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-black -z-10" />;

  return (
    <div className="fixed inset-0 bg-[#020202] -z-10 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#05051a_0%,#000000_100%)]" />
      
      {/* Simple stars */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random(),
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
    </div>
  );
}

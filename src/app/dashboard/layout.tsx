"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Send, QrCode, History, User, Scan, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Background } from "@/components/Background";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Transactions", icon: History, href: "/dashboard/history" },
    { label: "Scan & Pay", icon: Scan, href: "/dashboard/scan", primary: true },
    { label: "Send Money", icon: Send, href: "/dashboard/send" },
    { label: "My Code", icon: QrCode, href: "/dashboard/receive" },
  ];

  return (
    <div className="min-h-screen text-white selection:bg-blue-500/30">
      <Background />
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-80 bg-black/20 backdrop-blur-3xl border-r border-white/5 flex-col p-8 z-40">
        <div className="mb-16">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <nav className="flex-1 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6 px-4">Menu</p>
          {navItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "group flex items-center gap-4 px-4 h-14 rounded-2xl transition-all relative overflow-hidden",
                  mounted && pathname === item.href 
                    ? "bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_20px_-5px_rgba(37,99,235,0.2)]" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className={cn(
                  "w-6 h-6 transition-transform group-hover:scale-110",
                  mounted && pathname === item.href ? "text-blue-500" : "text-zinc-600"
                )} />
                <span className="font-bold tracking-tight">{item.label}</span>
                {mounted && pathname === item.href && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                  />
                )}
              </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/5">
          <Link 
            href="/dashboard/profile"
            className={cn(
              "flex items-center gap-4 px-4 h-14 rounded-2xl transition-all",
              mounted && pathname === "/dashboard/profile" ? "bg-white/5 text-white" : "text-zinc-500 hover:text-white"
            )}
          >
            <User className="w-6 h-6" />
            <span className="font-bold tracking-tight">Account</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-80 pb-32 lg:pb-0">
        <div className="container mx-auto px-6 py-12 max-w-5xl">
          <motion.div
            key={mounted ? pathname : 'initial'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-20 bg-black/40 backdrop-blur-2xl border border-white/10 flex items-center justify-around px-4 z-50 rounded-[2.5rem] shadow-2xl">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all relative",
              mounted && pathname === item.href ? "text-blue-500 scale-110" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {item.primary ? (
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center -mt-12 border-[6px] border-[#0c0c0c] shadow-2xl shadow-blue-600/40 transition-transform active:scale-90">
                <Scan className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className="relative">
                <item.icon className="w-7 h-7" />
                {mounted && pathname === item.href && (
                  <motion.div 
                    layoutId="mobile-dot"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,1)]"
                  />
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}

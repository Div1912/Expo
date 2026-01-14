"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, RefreshCw, AlertCircle, Loader2, Sparkles, Scan, ArrowLeft } from "lucide-react";

export default function ScanPage() {
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;
    setLoading(false);

    return () => {
      if (scanner.isScanning) {
        scanner.stop().catch(console.error);
      }
    };
  }, []);

  const startScanner = async () => {
    if (!scannerRef.current) return;
    setError(null);
    setScanning(true);

    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Ignore individual frame errors
        }
      );
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Camera access denied. Please check permissions.");
      setScanning(false);
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
    }
    setScanning(false);

    try {
        const data = JSON.parse(decodedText);
        if (data.type === "payment" && data.expo) {
          const params = new URLSearchParams();
          const username = data.expo.replace("@expo", "@expo");
          params.set("to", username);
          if (data.amount) params.set("amount", data.amount);
          if (data.note) params.set("note", data.note);
          
          router.push(`/dashboard/send?${params.toString()}`);
        } else {
          setError("Invalid EXPO QR Protocol");
        }
    } catch (e) {
      if (decodedText.includes("@") || decodedText.startsWith("G")) {
        const username = decodedText.replace("@expo", "@expo");
        router.push(`/dashboard/send?to=${username}`);
      } else {
        setError("Unrecognized QR Code Format");
      }
    }
  };

  const handleStop = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
      setScanning(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-12 pb-20">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 uppercase leading-none">
          SCAN & PAY
        </h1>
        <p className="text-zinc-500 font-medium text-lg">Instant settlement via visual routing</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group aspect-square"
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-[3rem] blur-2xl opacity-50" />
        
        <div className="relative h-full glass-card p-0 rounded-[2.5rem] overflow-hidden bg-black">
          <div id="reader" className="w-full h-full object-cover" />
          
          <AnimatePresence>
            {!scanning && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-black/60 backdrop-blur-md z-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 animate-pulse" />
                  <div className="relative w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-600/40">
                    <Camera className="w-10 h-10 text-white" />
                  </div>
                </div>
                  <div className="text-center px-8">
                    <h3 className="text-xl font-black tracking-tight mb-2 uppercase">Camera Required</h3>
                    <p className="text-zinc-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
                      EXPO needs camera access to process <br /> visual payment identities
                    </p>
                  </div>
                <Button 
                  onClick={startScanner} 
                  className="bg-white text-black hover:bg-zinc-200 font-black px-10 h-16 rounded-2xl text-lg shadow-2xl active:scale-95 transition-all"
                >
                  ACTIVATE SCANNER
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-30">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            </div>
          )}

          {scanning && (
            <>
              <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none z-10">
                <div className="w-full h-full border-2 border-blue-500/50 rounded-2xl relative">
                  <motion.div 
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]"
                  />
                </div>
              </div>
              <Button 
                onClick={handleStop}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 h-14 w-14 p-0 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500/40 border border-red-500/20 backdrop-blur-md z-20 transition-all active:scale-90"
              >
                <X className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500 text-sm font-black uppercase tracking-tight"
        >
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      <div className="flex flex-col gap-4">
        <Button 
          variant="outline" 
          className="h-16 border-white/10 hover:bg-white/5 rounded-2xl text-zinc-400 font-black uppercase tracking-widest gap-3 transition-all active:scale-95"
          onClick={() => router.push("/dashboard/send")}
        >
          Enter Identity Manually <ArrowLeft className="w-5 h-5 rotate-180" />
        </Button>
        <p className="text-[10px] text-zinc-600 text-center font-black uppercase tracking-[0.2em]">
          Powered by universal payment protocol v1.2
        </p>
      </div>
    </div>
  );
}

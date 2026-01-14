"use client";

import { useEffect, useRef } from "react";

type ReporterProps = {
  /*  ⎯⎯ props are only provided on the global-error page ⎯⎯ */
  error?: Error & { digest?: string };
  reset?: () => void;
};

export default function ErrorReporter({ error, reset }: ReporterProps) {
  /* ─ instrumentation shared by every route ─ */
  const lastOverlayMsg = useRef("");
  const pollRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const inIframe = window.parent !== window;
    if (!inIframe) return;

    const send = (payload: unknown) => window.parent.postMessage(payload, "*");

    const onError = (e: ErrorEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.message,
          stack: e.error?.stack,
          filename: e.filename,
          lineno: e.lineno,
          colno: e.colno,
          source: "window.onerror",
        },
        timestamp: Date.now(),
      });

    const onReject = (e: PromiseRejectionEvent) =>
      send({
        type: "ERROR_CAPTURED",
        error: {
          message: e.reason?.message ?? String(e.reason),
          stack: e.reason?.stack,
          source: "unhandledrejection",
        },
        timestamp: Date.now(),
      });

    const pollOverlay = () => {
      const overlay = document.querySelector("[data-nextjs-dialog-overlay]");
      const node =
        overlay?.querySelector(
          "h1, h2, .error-message, [data-nextjs-dialog-body]"
        ) ?? null;
      const txt = node?.textContent ?? node?.innerHTML ?? "";
      if (txt && txt !== lastOverlayMsg.current) {
        lastOverlayMsg.current = txt;
        send({
          type: "ERROR_CAPTURED",
          error: { message: txt, source: "nextjs-dev-overlay" },
          timestamp: Date.now(),
        });
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onReject);
    pollRef.current = setInterval(pollOverlay, 1000);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onReject);
      pollRef.current && clearInterval(pollRef.current);
    };
  }, []);

  /* ─ extra postMessage when on the global-error route ─ */
  useEffect(() => {
    if (!error) return;
    window.parent.postMessage(
      {
        type: "global-error-reset",
        error: {
          message: error.message,
          stack: error.stack,
          digest: error.digest,
          name: error.name,
        },
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
      },
      "*"
    );
  }, [error]);

  /* ─ ordinary pages render nothing ─ */
  if (!error) return null;

  /* ─ global-error UI ─ */
  return (
    <div className="fixed inset-0 z-[9999] min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 glass-card p-8 rounded-2xl border border-red-500/20">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-red-500 tracking-tight">
            SOMETHING WENT WRONG
          </h1>
          <p className="text-zinc-400 font-medium">
            An unexpected error occurred. Please try again.
          </p>
        </div>
        <div className="space-y-2">
          {process.env.NODE_ENV === "development" && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-300 font-bold uppercase tracking-widest">
                Error details
              </summary>
              <pre className="mt-2 text-[10px] bg-white/5 p-4 rounded-xl overflow-auto border border-white/10 text-red-400">
                {error.message}
                {error.stack && (
                  <div className="mt-2 opacity-50">
                    {error.stack}
                  </div>
                )}
              </pre>
            </details>
          )}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full h-12 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
        >
          RELOAD PAGE
        </button>
      </div>
    </div>
  );
}

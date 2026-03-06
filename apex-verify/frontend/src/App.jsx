import React from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import ImageAnalysis from "./pages/ImageAnalysis";
import VideoAnalysis from "./pages/VideoAnalysis";
import MetricsDashboard from "./pages/MetricsDashboard";

function Header() {
  const location = useLocation();

  return (
    <header className="relative z-10 glass border-b border-border sticky top-0">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-blue-500 flex items-center justify-center text-background font-bold text-sm shadow-glow">
            ⚡
          </div>
          <div>
            <h1 className="text-sm font-bold text-textPrimary tracking-tight">
              DeepClaim AI
              <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-accent/10 text-accent rounded border border-accent/20 font-medium">
                v2.0
              </span>
            </h1>
            <p className="text-[10px] text-textMuted">
              AI-Powered Insurance Fraud Detection
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${location.pathname === "/"
              ? "bg-accent/20 text-accent border border-accent/20"
              : "text-textMuted hover:text-textPrimary hover:bg-surfaceHover border border-transparent"
              }`}
          >
            Image Analysis
          </Link>
          <Link
            to="/video"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${location.pathname === "/video"
              ? "bg-danger/20 text-danger border border-danger/20"
              : "text-textMuted hover:text-textPrimary hover:bg-surfaceHover border border-transparent"
              }`}
          >
            <span className={location.pathname === "/video" ? "animate-pulse" : ""}>🔴</span>
            Dashcam/CCTV Crash
          </Link>
          <Link
            to="/metrics"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${location.pathname === "/metrics"
              ? "bg-warning/20 text-warning border border-warning/20"
              : "text-textMuted hover:text-textPrimary hover:bg-surfaceHover border border-transparent"
              }`}
          >
            📊 Model Metrics
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-textPrimary">
        {/* ── Background grid pattern ── */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.07) 0%, transparent 55%)",
          }}
        />

        <Header />

        <main className="relative z-10 pt-6">
          <Routes>
            <Route path="/" element={<ImageAnalysis />} />
            <Route path="/video" element={<VideoAnalysis />} />
            <Route path="/metrics" element={<MetricsDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

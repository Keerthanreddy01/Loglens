"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  Terminal,
  Search,
  CheckCircle2,
  ChevronRight,
  Menu,
  X,
  Clock,
  Circle,
} from "lucide-react";

// --- Components ---

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-black">
      <div className="noise-overlay" />

      {/* Central Premium Orb (Amber/Orange) */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-[20%] rounded-full opacity-40 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(120, 53, 15, 0.1) 40%, transparent 70%)",
        }}
      />

      {/* Intense Core Glow */}
      <div
        className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-[30%] rounded-full opacity-20 blur-[60px]"
        style={{
          background: "radial-gradient(circle, white 0%, rgba(245, 158, 11, 0.2) 50%, transparent 100%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

function NavLink({ href, children, active = false }: { href: string; children: React.ReactNode; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`relative px-6 py-2 text-sm font-medium transition-all duration-300 ${active ? "text-black" : "text-zinc-400 hover:text-white"
        }`}
    >
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute inset-0 z-0 bg-white rounded-full"
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.05)]"
    >
      <div className="relative h-2 w-2">
        <div className="absolute inset-0 rounded-full bg-amber-500 opacity-20 animate-ping" />
        <div className="relative h-2 w-2 rounded-full bg-amber-500" />
      </div>
      {children}
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 transition-all hover:bg-[#0d0d0d] hover:shadow-2xl hover:shadow-amber-500/5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-2 font-semibold text-white">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
    </div>
  );
}

function AnimatedDashboardImage({ src, alt, tilt = "right" }: { src: string; alt: string; tilt?: "left" | "right" }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        y: 100,
        rotateX: 45,
        rotateY: tilt === "right" ? -5 : 5,
        scale: 0.9
      }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1
      } : {}}
      transition={{
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.8 }
      }}
      className="relative z-10 mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.02] px-4 py-3">
        <div className="h-2 w-2 rounded-full bg-red-500/50" />
        <div className="h-2 w-2 rounded-full bg-amber-500/50" />
        <div className="h-2 w-2 rounded-full bg-emerald-500/50" />
      </div>
      <img
        src={src}
        alt={alt}
        className="w-full opacity-90 transition-opacity duration-1000 group-hover:opacity-100"
      />
      {/* Dynamic glow beneath the image */}
      <div className="absolute -inset-2 bg-blue-500/20 blur-3xl opacity-0 transition-opacity duration-1000 peer-hover:opacity-100" />
    </motion.div>
  );
}

// --- Main Page ---

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 selection:text-white">
      <AmbientBackground />

      {/* Navigation - Premium Pill Style */}
      <nav className="fixed top-8 z-[60] w-full px-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex h-8 items-center justify-center">
                <span className="text-xl font-black tracking-tighter uppercase italic">LogLens</span>
              </div>
            </div>
          </Link>

          {/* Floating Pill Nav */}
          <div className="hidden md:flex items-center rounded-full border border-white/10 bg-black/40 p-1 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <NavLink href="/" active>Home</NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="https://docs.loglens.dev">Docs</NavLink>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-10 px-8 bg-amber-900/40 border border-amber-500/20 text-amber-200 hover:bg-amber-800/60 active:scale-95 transition-all font-bold rounded-full uppercase text-xs tracking-widest backdrop-blur-md">
                Get Started
              </Button>
            </Link>
            <button className="md:hidden text-zinc-400 hover:text-white transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {/* Hero Section - Neptune Style */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-20">
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo Title (Massive Neptune Style) */}
          <motion.h1
            className="text-[14vw] font-black uppercase tracking-[-0.05em] leading-[0.8] text-white"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
          >
            LogLens
          </motion.h1>

          {/* Tagline (Huge & Minimal) */}
          <motion.h2
            className="mt-12 max-w-6xl text-center text-4xl font-light tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Log intelligence built for builders.
          </motion.h2>

          {/* Subheader / Status Line */}
          <motion.div
            className="mt-16 flex flex-col items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.4em] text-amber-500/60">
              LogLens 2.0 is now available
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
          </motion.div>

          <motion.p
            className="mx-auto mt-12 max-w-2xl text-lg text-white/40 sm:text-xl font-light tracking-widest uppercase leading-relaxed text-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            Production-grade log analysis with AI-powered pattern detection, real-time streaming, and global search.
          </motion.p>
        </motion.div>

        {/* Hero Dashboard Preview Section (Now following the primary fold) */}
        <motion.div
          className="relative mt-20 w-full max-w-6xl px-4"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#050505] p-2 shadow-[0_0_100px_-20px_rgba(245,158,11,0.1)]">
            <div className="relative overflow-hidden rounded-[2rem] bg-[#0a0a0a]">
              <div className="flex items-center gap-1.5 border-b border-white/5 bg-white/[0.02] px-6 py-4">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                </div>
                <div className="ml-6 flex h-5 w-48 rounded-full bg-white/5" />
              </div>

              <div className="relative aspect-[16/9] w-full p-8 md:p-12">
                <div className="grid grid-cols-12 gap-6 h-full">
                  {/* Left Column: Analytics Stats */}
                  <div className="col-span-12 md:col-span-4 space-y-6">
                    {[
                      { label: "Throughput", value: "128k", unit: "req/s", color: "amber" },
                      { label: "Error Rate", value: "0.02", unit: "%", color: "emerald" },
                      { label: "Latency", value: "14", unit: "ms", color: "amber" }
                    ].map((stat, i) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                      >
                        <div className="text-sm font-medium text-zinc-500">{stat.label}</div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                          <span className="text-zinc-500 text-sm">{stat.unit}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Visualization */}
                  <div className="col-span-12 md:col-span-8 relative">
                    <div className="h-full rounded-2xl border border-white/5 bg-black/40 p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-sm font-medium text-zinc-400">System Health / Real-time</div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-1 w-3 rounded-full bg-amber-500/30" />)}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[40, 70, 50, 90, 60].map((w, i) => (
                          <motion.div
                            key={i}
                            initial={{ width: 0 }}
                            animate={{ width: `${w}%` }}
                            transition={{ duration: 2, delay: 0.8 + i * 0.1, repeat: Infinity, repeatType: "reverse" }}
                            className="h-2 rounded-full bg-gradient-to-r from-amber-600/40 to-transparent"
                          />
                        ))}
                      </div>

                      <div className="mt-12 space-y-3 font-mono text-[10px]">
                        {[
                          { time: "12:04:21", type: "INFO", msg: "Worker node 42 initialized" },
                          { time: "12:04:22", type: "WARN", msg: "Memory pressure above 80%" },
                          { time: "12:04:23", type: "INFO", msg: "Cleaning cache in us-east-1" },
                        ].map((log, i) => (
                          <div key={i} className="flex gap-4 text-zinc-600">
                            <span>[{log.time}]</span>
                            <span className={log.type === "WARN" ? "text-amber-500/60" : "text-amber-500/60"}>{log.type}</span>
                            <span className="text-zinc-400">{log.msg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Visual Flair */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-amber-500/20 to-orange-500/20 blur opacity-30 transition-opacity pointer-events-none" />
          </div>

          {/* Floating Decorators */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-12 top-1/2 h-48 w-48 rounded-3xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 shadow-2xl hidden lg:block"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <div className="text-sm font-semibold text-white mb-2">Secure Stream</div>
            <div className="text-[11px] text-zinc-500 leading-relaxed">Encrypted at edge with zero-knowledge keys.</div>
          </motion.div>
        </motion.div>
      </section>

      {/* Replaced Features Section with Interactive Demo */}
      <section id="features" className="relative py-32 overflow-hidden border-t border-white/5 bg-black/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Section Header */}
          <div className="mb-20 text-center">
            <SectionBadge>Log Intelligence</SectionBadge>
            <h2 className="mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Production observability,
              <br />
              <span className="text-shine">reimagined.</span>
            </h2>
          </div>

          {/* Interactive Agent Section */}
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center mb-48">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-1.5 text-xs font-semibold text-amber-400 uppercase tracking-widest"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Intelligence Engine 2.0
              </motion.div>
              <h3 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight leading-tight">
                AI-assisted
                <br />
                troubleshooting.
              </h3>
              <p className="text-xl text-zinc-400 leading-relaxed max-w-lg font-light">
                <span className="text-white font-semibold italic">Sprint for Logs.</span> Delegate root cause analysis to autonomous agents trained on trillions of log patterns.
              </p>
              <Button size="lg" className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)] font-bold">
                Experience Logic
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative group">
              <div className="absolute -inset-10 bg-amber-600/10 blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#080808] p-1 shadow-2xl">
                <div className="rounded-[2rem] bg-[#0c0c0c] p-10">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-6">
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">System Agents</span>
                      <div className="flex gap-1.5">
                        <div className="h-1.5 w-8 rounded-full bg-amber-500" />
                        <div className="h-1.5 w-4 rounded-full bg-zinc-800" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { name: "Cursor", role: "Logic", icon: Terminal, active: true, color: "amber" },
                        { name: "GitHub Copilot", role: "Assist", icon: Sparkles, active: false, color: "zinc" },
                        { name: "Sentry", role: "Trace", icon: Shield, active: false, color: "zinc" },
                      ].map((agent, i) => (
                        <motion.div
                          key={agent.name}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`flex items-center justify-between rounded-[1.25rem] p-5 transition-all ${agent.active
                            ? "bg-white/5 border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                            : "bg-transparent border border-transparent hover:bg-white/[0.02]"
                            }`}
                        >
                          <div className="flex items-center gap-5">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${agent.active ? "bg-white text-black shadow-lg" : "bg-zinc-900/50 text-zinc-500"
                              }`}>
                              <agent.icon className="h-7 w-7" />
                            </div>
                            <div>
                              <span className={`block font-bold text-lg ${agent.active ? "text-white" : "text-zinc-500"}`}>{agent.name}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                                {agent.role} Agent
                              </span>
                            </div>
                          </div>
                          {agent.active && (
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Active</span>
                              <motion.div
                                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="h-2 w-2 rounded-full bg-amber-500 border border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Preview Section */}
          <div className="relative mt-48">
            <div className="text-center mb-20">
              <SectionBadge>Platform Overview</SectionBadge>
              <h3 className="mt-6 text-3xl font-extrabold text-white sm:text-5xl tracking-tight">Everything at a glance.</h3>
              <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-500 font-light">A unified dashboard designed for extreme clarity and performance.</p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[3rem] border border-white/10 bg-[#050505] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
            >
              <div className="flex flex-col md:flex-row h-[700px]">
                {/* Mock Sidebar */}
                <div className="w-full md:w-72 border-r border-white/5 bg-black/40 p-8 hidden md:block backdrop-blur-3xl">
                  <div className="flex items-center gap-3 mb-12">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-lg transform rotate-3">
                      <BarChart3 className="h-6 w-6 text-black" />
                    </div>
                    <span className="font-extrabold text-xl tracking-tighter">LogLens</span>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 ml-2">Main</div>
                      <div className="flex items-center gap-3 text-white bg-white/10 rounded-xl px-4 py-3 text-sm font-semibold shadow-inner">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Live Stream
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500 hover:text-white px-4 py-3 text-sm transition-all duration-300 cursor-pointer hover:bg-white/5 rounded-xl">
                        <Search className="h-4 w-4" />
                        Search
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 ml-2">Intelligence</div>
                      <div className="flex items-center gap-3 text-zinc-500 hover:text-white px-4 py-3 text-sm transition-all duration-300 cursor-pointer hover:bg-white/5 rounded-xl">
                        <Terminal className="h-4 w-4" />
                        Pattern Lab
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500 hover:text-white px-4 py-3 text-sm transition-all duration-300 cursor-pointer hover:bg-white/5 rounded-xl">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Content Area */}
                <div className="flex-1 flex flex-col bg-gradient-to-br from-[#0a0a0a] to-[#050505]">
                  <div className="flex items-center justify-between border-b border-white/5 px-10 py-6 backdrop-blur-sm bg-black/20">
                    <div className="flex items-center gap-4 text-sm font-medium">
                      <span className="text-zinc-600">Infrastructure</span>
                      <ChevronRight className="h-3 w-3 text-zinc-800" />
                      <span className="text-zinc-400">Clusters</span>
                      <ChevronRight className="h-3 w-3 text-zinc-800" />
                      <span className="text-white bg-amber-500/10 px-2 py-0.5 rounded text-[11px] font-bold text-amber-400 border border-amber-500/20">PROD-SERVER-01</span>
                    </div>
                  </div>

                  <div className="p-10 overflow-hidden">
                    <div className="max-w-4xl">
                      <div className="flex items-center justify-between mb-8">
                        <h4 className="text-3xl font-extrabold text-white tracking-tight">Active Anomalies</h4>
                        <div className="flex gap-2">
                          <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none flex items-center">Critical: 1</div>
                          <div className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 uppercase tracking-widest leading-none flex items-center">Warning: 4</div>
                        </div>
                      </div>

                      <div className="space-y-6 font-mono text-xs">
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="rounded-[1.5rem] bg-black border border-white/10 p-8 overflow-hidden relative group hover:border-white/20 transition-all duration-500"
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <span className="text-red-500 font-bold uppercase tracking-[0.2em]">High Severity Alert</span>
                            <span className="ml-auto text-zinc-700">12:42:01.324</span>
                          </div>
                          <div className="space-y-2 mb-8">
                            <code className="text-zinc-400 block whitespace-pre leading-relaxed">
                              <span className="text-zinc-500">2024-02-02T12:42:01.324Z</span> <span className="text-red-400 font-bold">[ERR]</span> <span className="text-white">Connection pool exhausted</span>
                              <br />
                              <span className="text-zinc-600 italic">  at PostgresConnectionPool.acquire (pool.js:142)</span>
                              <br />
                              <span className="text-zinc-600 italic">  at async RequestHandler.execute (router.ts:89)</span>
                            </code>
                          </div>

                          <div className="border-t border-white/5 pt-6 mt-6">
                            <div className="flex items-center gap-4 text-zinc-500 mb-4">
                              <Sparkles className="h-4 w-4 text-amber-500" />
                              <span className="text-[10px] font-bold uppercase tracking-widest">AI Recommendation Engine</span>
                            </div>
                            <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                              Detect peak traffic pattern in <span className="text-white font-bold underline decoration-amber-500/50">us-east-1</span>. Scaling group <span className="text-emerald-400 font-bold">API-GATEWAY</span> to 8 units to resolve connection overhead.
                            </p>
                          </div>

                          <div className="flex gap-4 mt-8">
                            <Button size="sm" className="h-10 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold active:scale-95 transition-all shadow-lg">
                              Apply Recommendation
                            </Button>
                            <Button size="sm" variant="outline" className="h-10 px-6 rounded-xl border-white/10 bg-white/5 text-zinc-400 hover:text-white font-bold active:scale-95 transition-all">
                              Deep Inspect
                            </Button>
                          </div>

                          {/* Inner glow */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -z-10 group-hover:bg-amber-500/10 transition-all duration-1000" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glass overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* Value Cards - Ultra Premium */}
          <div className="mt-48 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: "Nano-latency", desc: "Sub-millisecond ingestion times at any scale, guaranteed.", color: "from-amber-500 to-orange-500" },
              { icon: Shield, title: "Zero Knowledge", desc: "E2E encryption where your logs never touch our disks in plaintext.", color: "from-emerald-500 to-teal-500" },
              { icon: Sparkles, title: "Autopilot", desc: "Autonomous self-healing infrastructure managed by specialized AI.", color: "from-purple-500 to-pink-500" }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0a0a0a] p-10 hover:border-white/10 transition-all duration-500 hover:shadow-2xl hover:shadow-white/[0.02]"
              >
                <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-extrabold text-white tracking-tight">{feature.title}</h3>
                <p className="text-zinc-500 text-lg leading-relaxed font-light">{feature.desc}</p>
                <div className="mt-8 flex items-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-600 transition-colors group-hover:text-white">
                  Full Feature Details <ChevronRight className="ml-2 h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Glass Style */}
      <section id="pricing" className="relative py-48 border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-20">
            <SectionBadge>Pricing Ecosystem</SectionBadge>
            <h2 className="mt-8 text-4xl font-extrabold text-white sm:text-6xl tracking-tighter">
              Build first, pay later.
            </h2>
            <p className="mt-6 text-lg text-zinc-500 font-light">
              Simple credits-based system for teams of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Developer Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#080808] p-12 transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-white/[0.01]"
            >
              <div className="mb-12">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6">Standard Edition</div>
                <h3 className="text-3xl font-extrabold text-white mb-4 italic">Individual</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-extrabold text-white tracking-tighter">$0</span>
                  <span className="text-zinc-600 text-xl">Forever</span>
                </div>
              </div>
              <ul className="mb-12 space-y-6">
                {[
                  "Unlimited data streaming",
                  "Standard AI Agent tier",
                  "7-day retention history",
                  "E2E workspace encryption"
                ].map(item => (
                  <li key={item} className="flex items-center gap-4 text-zinc-400 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full h-16 rounded-[1.25rem] bg-zinc-900 border border-white/10 text-white hover:bg-white hover:text-black transition-all duration-500 text-lg font-bold shadow-xl active:scale-95">
                  Start Building Free
                </Button>
              </Link>
            </motion.div>

            {/* Enterprise Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="relative group overflow-hidden rounded-[2.5rem] border border-amber-500/30 bg-amber-500/[0.02] p-12 transition-all hover:border-amber-500/50"
            >
              <div className="absolute top-8 right-12 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 bg-amber-500/10 px-4 py-2 rounded-full border border-amber-500/20">
                Waitlist Active
              </div>
              <div className="mb-12">
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-amber-500/60 mb-6">Professional Tier</div>
                <h3 className="text-3xl font-extrabold text-white mb-4 italic">Enterprise</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-7xl font-extrabold text-white tracking-tighter">$49</span>
                  <span className="text-zinc-600 text-xl">/mo</span>
                </div>
              </div>
              <ul className="mb-12 space-y-6">
                {[
                  "Everything in Developer",
                  "Advanced AI Agent Logic",
                  "Unlimited history retention",
                  "SLA & Dedicated Support"
                ].map(item => (
                  <li key={item} className="flex items-center gap-4 text-zinc-300 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button disabled className="w-full h-16 rounded-[1.25rem] bg-amber-500 text-white font-bold text-lg opacity-40">
                Coming Soon
              </Button>

              {/* Background gradient */}
              <div className="absolute -inset-10 bg-amber-500/5 blur-[100px] -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-48 overflow-hidden border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-6xl font-extrabold text-white sm:text-8xl tracking-tight leading-[0.9]">
              Ready to <span className="text-shine italic">accelerate?</span>
            </h2>
            <p className="mx-auto mt-10 max-w-xl text-xl text-zinc-500 font-light leading-relaxed">
              Join the world's most innovative engineering teams and redefine how you debug production software.
            </p>
            <div className="mt-16 flex flex-col items-center justify-center gap-8 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="h-16 px-12 bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)] rounded-2xl font-extrabold text-xl">
                  Get Started Now
                </Button>
              </Link>
              <Link href="https://github.com/loglens">
                <Button size="lg" variant="ghost" className="h-16 px-12 text-xl text-zinc-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all rounded-2xl font-bold">
                  View Repository
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Foot glow - Enhanced */}
        <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 h-[500px] w-[1200px] rounded-[full] bg-amber-600/10 blur-[150px] -z-10" />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-200">
                <BarChart3 className="h-3 w-3 text-black" />
              </div>
              <span className="text-sm font-semibold text-zinc-200">LogLens</span>
              <span className="ml-2 text-xs text-zinc-600">© 2024 LogLens Inc.</span>
            </div>
            <div className="flex gap-8">
              <Link href="https://twitter.com/loglens" className="text-sm text-zinc-600 hover:text-white">Twitter</Link>
              <Link href="https://github.com/loglens" className="text-sm text-zinc-600 hover:text-white">GitHub</Link>
              <Link href="/privacy" className="text-sm text-zinc-600 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-sm text-zinc-600 hover:text-white">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
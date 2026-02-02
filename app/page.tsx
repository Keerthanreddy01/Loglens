"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
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
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Subtle ambient background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-black to-black pointer-events-none" />

      {/* Navigation - Slash Style */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold tracking-tight">
              LogLens
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8 text-sm">
              <button className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
                Company <ChevronDown className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
                Products <ChevronDown className="h-4 w-4" />
              </button>
              <button className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors">
                Solutions <ChevronDown className="h-4 w-4" />
              </button>
              <Link href="#customers" className="text-zinc-400 hover:text-white transition-colors">
                Customers
              </Link>
              <Link href="#pricing" className="text-zinc-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="text-zinc-400 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-sm text-zinc-400 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/dashboard">
                <Button className="h-9 px-5 bg-white text-black hover:bg-zinc-200 rounded-full text-sm font-medium">
                  Get Started
                </Button>
              </Link>
              <button
                className="md:hidden text-zinc-400"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Slash Typography Style */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif leading-[1.1] mb-8"
          >
            Log intelligence built for{" "}
            <em className="font-serif italic">builders</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-lg text-zinc-400 max-w-xl mx-auto mb-10"
          >
            Production-grade log analysis with AI-powered pattern detection,
            real-time streaming, and zero infrastructure.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-16"
          >
            <Link href="/dashboard">
              <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-full text-base font-medium">
                Get Started
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" className="h-12 px-8 border-white/10 text-white hover:bg-white/5 rounded-full text-base font-medium">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Dashboard Preview - Using Original LogLens Design */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mx-auto max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-1.5">
            <div className="relative overflow-hidden rounded-2xl bg-zinc-950">
              {/* Browser Chrome */}
              <div className="flex items-center gap-1.5 border-b border-white/5 bg-black/40 px-6 py-4 backdrop-blur-xl">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                </div>
                <div className="ml-6 flex h-5 w-48 rounded-full bg-white/5" />
              </div>

              {/* Dashboard Content */}
              <div className="p-8 md:p-12">
                <div className="grid grid-cols-12 gap-6 h-full">
                  {/* Left Column: Analytics Stats */}
                  <div className="col-span-12 md:col-span-4 space-y-6">
                    {[
                      { label: "Throughput", value: "128k", unit: "req/s", color: "amber" },
                      { label: "Error Rate", value: "0.02", unit: "%", color: "emerald" },
                      { label: "Latency", value: "14", unit: "ms", color: "amber" }
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
                      >
                        <div className="text-sm font-medium text-zinc-500">{stat.label}</div>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                          <span className="text-zinc-500 text-sm">{stat.unit}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Right Column: Visualization */}
                  <div className="col-span-12 md:col-span-8 relative">
                    <div className="h-full rounded-2xl border border-white/5 bg-black/40 p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="text-sm font-medium text-zinc-400">System Health / Real-time</div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-1 w-3 rounded-full bg-amber-500/30" />
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[40, 70, 50, 90, 60].map((w, i) => (
                          <motion.div
                            key={i}
                            initial={{ width: 0 }}
                            animate={{ width: `${w}%` }}
                            transition={{ duration: 1.5, delay: 0.8 + i * 0.1 }}
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
                          <motion.div
                            key={i}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 + i * 0.1 }}
                            className="flex gap-4 text-zinc-600"
                          >
                            <span>[{log.time}]</span>
                            <span className={log.type === "WARN" ? "text-amber-500/60" : "text-emerald-500/60"}>{log.type}</span>
                            <span className="text-zinc-400">{log.msg}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Ambient glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 blur-xl opacity-50 -z-10" />
          </div>
        </motion.div>
      </section>

      {/* Features Section - Slash Card Style */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-6xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif leading-[1.1] mb-6"
          >
            Production observability,
            <br />
            <em className="italic">reimagined</em>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto"
          >
            AI-powered insights and real-time analysis for modern engineering teams.
          </motion.p>
        </div>

        <div className="mx-auto max-w-7xl grid md:grid-cols-3 gap-8">
          {/* AI Pattern Detection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 mb-6">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Pattern Detection</h3>
            <p className="text-zinc-400 leading-relaxed">
              Automatically identify critical errors, patterns, and anomalies with confidence scores.
            </p>
          </motion.div>

          {/* Zero Infrastructure */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 mb-6">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">100% Private</h3>
            <p className="text-zinc-400 leading-relaxed">
              Everything runs in your browser. Your logs never leave your machine.
            </p>
          </motion.div>

          {/* Real-time Streaming */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 mb-6">
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-zinc-400 leading-relaxed">
              Handle 100K+ logs with smooth performance. Sub-millisecond search.
            </p>
          </motion.div>
        </div>
      </section>

      {/* AI Intelligence Section - Slash Two-Column Style */}
      <section className="relative py-32 px-6 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-8">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Engine 2.0
                </div>
                <h2 className="text-5xl md:text-6xl font-serif leading-tight mb-6">
                  AI-assisted
                  <br />
                  <em className="italic">troubleshooting</em>
                </h2>
                <p className="text-xl text-zinc-400 leading-relaxed mb-8">
                  Delegate root cause analysis to autonomous agents trained on trillions of log patterns.
                </p>
                <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-full font-medium">
                  Experience Logic
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-amber-500/5 blur-3xl rounded-full" />
              <div className="relative rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-8">
                <div className="space-y-4">
                  {[
                    { name: "Pattern Analyzer", active: true, icon: Terminal },
                    { name: "Error Classifier", active: false, icon: Shield },
                    { name: "Anomaly Detector", active: false, icon: Sparkles },
                  ].map((agent, i) => (
                    <div
                      key={agent.name}
                      className={`flex items-center justify-between rounded-2xl p-5 transition-all ${agent.active
                        ? "bg-white/5 border border-white/10"
                        : "bg-transparent border border-transparent hover:bg-white/[0.02]"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-xl ${agent.active ? "bg-white text-black" : "bg-zinc-900/50 text-zinc-500"
                            }`}
                        >
                          <agent.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className={`font-semibold ${agent.active ? "text-white" : "text-zinc-500"}`}>
                            {agent.name}
                          </div>
                          <div className="text-xs text-zinc-600 uppercase tracking-wider">AI Agent</div>
                        </div>
                      </div>
                      {agent.active && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">Active</span>
                          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Slash Style */}
      <section id="pricing" className="relative py-32 px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-serif mb-6">
              Build first,
              <br />
              <em className="italic">pay later</em>
            </h2>
            <p className="text-xl text-zinc-400">Simple pricing for teams of all sizes.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 p-12"
            >
              <div className="mb-12">
                <div className="text-sm text-zinc-500 uppercase tracking-wider mb-4">Standard Edition</div>
                <h3 className="text-3xl font-serif italic mb-4">Individual</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold">$0</span>
                  <span className="text-zinc-500">Forever</span>
                </div>
              </div>
              <ul className="space-y-4 mb-12">
                {[
                  "Unlimited log uploads",
                  "AI pattern detection",
                  "7-day retention",
                  "Browser-based processing"
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-400">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard">
                <Button className="w-full h-12 bg-zinc-900 hover:bg-white hover:text-black border border-white/10 rounded-full font-medium transition-all">
                  Start Building Free
                </Button>
              </Link>
            </motion.div>

            {/* Pro Tier */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-zinc-950/50 p-12 relative"
            >
              <div className="absolute top-8 right-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                  Waitlist
                </span>
              </div>
              <div className="mb-12">
                <div className="text-sm text-amber-500/60 uppercase tracking-wider mb-4">Professional Tier</div>
                <h3 className="text-3xl font-serif italic mb-4">Enterprise</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold">$49</span>
                  <span className="text-zinc-500">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-12">
                {[
                  "Everything in Individual",
                  "Advanced AI agents",
                  "Unlimited retention",
                  "Priority support"
                ].map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button disabled className="w-full h-12 bg-amber-500 text-white rounded-full font-medium opacity-40">
                Coming Soon
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA - Slash Style */}
      <section className="relative py-32 px-6 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-serif mb-8">
              Ready to <em className="italic">accelerate</em>?
            </h2>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
              Join innovative engineering teams and redefine how you debug production software.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button className="h-14 px-10 bg-white text-black hover:bg-zinc-200 rounded-full text-lg font-medium">
                  Get Started Now
                </Button>
              </Link>
              <Link href="https://github.com/loglens">
                <Button variant="outline" className="h-14 px-10 border-white/10 hover:bg-white/5 rounded-full text-lg font-medium">
                  View Repository
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-zinc-600">
              © 2024 LogLens Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-8 text-sm text-zinc-600">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/docs" className="hover:text-white transition-colors">Docs</Link>
              <Link href="https://github.com" className="hover:text-white transition-colors">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
'use client'

import React, { useRef, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/ui/button'
import { ArrowRight, Zap, Shield, CheckCircle2, TrendingUp, Activity, Bell, BarChart3, Database, Check } from 'lucide-react'
import { motion } from 'motion/react'

export default function LandingClient() {
  const heroRef = useRef<HTMLElement>(null)
  const dashboardRef = useRef<HTMLDivElement>(null)

  // Memoize animation variants for better performance
  const fadeInVariants = useMemo(() => ({
    initial: { opacity: 0.9, y: 10 },
    animate: { opacity: 1, y: 0 }
  }), [])

  // Optimized scroll handler with useCallback
  const handleAnchorClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    const anchor = target.closest('a[href^="#"]')
    if (anchor) {
      e.preventDefault()
      const href = anchor.getAttribute('href')
      if (href && href !== '#') {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }
    }
  }, [])

  // Smooth scroll behavior with optimized event listener
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    document.addEventListener('click', handleAnchorClick, { passive: false })
    return () => {
      document.removeEventListener('click', handleAnchorClick)
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [handleAnchorClick])

  return (
    <div className="min-h-screen bg-[#050507] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center">
        <div className="relative bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] rounded-full px-6 py-3 max-w-4xl w-full mx-auto">
          {/* Glass reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none rounded-full" />

          <div className="relative flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="text-black font-bold text-sm">L</span>
              </div>
              <span className="font-bold text-lg">LogLens</span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm">
              <Link href="#features" className="relative text-zinc-400 hover:text-white transition-colors duration-300 group">
                <span>Features</span>
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-amber-400 to-yellow-300 group-hover:w-full transition-all duration-500" />
              </Link>
              <Link href="#how-it-works" className="relative text-zinc-400 hover:text-white transition-colors duration-300 group">
                <span>How It Works</span>
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-amber-400 to-yellow-300 group-hover:w-full transition-all duration-500" />
              </Link>
              <Link href="#pricing" className="relative text-zinc-400 hover:text-white transition-colors duration-300 group">
                <span>Pricing</span>
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-amber-400 to-yellow-300 group-hover:w-full transition-all duration-500" />
              </Link>
              <Link href="#docs" className="relative text-zinc-400 hover:text-white transition-colors duration-300 group">
                <span>Docs</span>
                <div className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-amber-400 to-yellow-300 group-hover:w-full transition-all duration-500" />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link href="/dashboard">
                <div className="relative group">
                  {/* Compact gold shimmer */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300" />

                  <Button className="relative h-9 px-4 bg-white text-black rounded-full font-semibold text-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg active:scale-95">
                    <span className="relative z-10">Start Now</span>
                    <ArrowRight className="relative z-10 w-3.5 h-3.5 ml-1.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </Button>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6">
        {/* Animated Hero Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-purple-500/10 via-blue-500/5 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl text-center relative z-10">

          {/* Product Context Badge */}
          <motion.div
            initial={{ opacity: 0.9, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-white">AI-Powered Log Analytics Platform</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0.9, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[clamp(2.5rem,7vw,5rem)] font-bold text-white leading-[1.1] tracking-tight mb-6"
          >
            Infrastructure intelligence,
            <br />
            decoded in real time.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0.9, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-400 leading-relaxed max-w-3xl mx-auto mb-12"
          >
            LogLens transforms raw production logs into real-time insights, alerts, and root-cause analysis for modern systems.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0.9, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Link href="/dashboard">
              <div className="relative group">
                {/* Gold shimmer effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 group-hover:duration-200" />
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 rounded-full opacity-0 group-hover:opacity-30 blur-md transition-all duration-700" />

                <Button className="relative h-12 px-8 bg-white text-black rounded-full font-semibold text-sm shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] active:scale-95">
                  <span className="relative z-10">Get Started Free</span>
                  <ArrowRight className="relative z-10 w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-amber-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </div>
            </Link>
            <Link href="#demo">
              <div className="relative group">
                {/* Subtle gold border glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400/20 via-yellow-300/20 to-amber-400/20 rounded-full opacity-0 group-hover:opacity-100 blur transition-all duration-500" />

                <Button variant="outline" className="relative h-12 px-8 border-2 border-white/20 text-white rounded-full font-semibold text-sm transition-all duration-300 group-hover:border-amber-200/40 group-hover:bg-white/10 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(251,191,36,0.15)] active:scale-95">
                  <span className="relative z-10">View Live Demo</span>
                  {/* Animated dashed underline */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent group-hover:w-3/4 transition-all duration-500" />
                </Button>
              </div>
            </Link>
          </motion.div>

          {/* Trust Signal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-sm text-zinc-600"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>No credit card required • Free forever plan</span>
          </motion.div>
        </div>

        {/* Product Preview */}
        <motion.div
          ref={dashboardRef}
          initial={{ opacity: 0.8, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mt-20 px-6 max-w-7xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-blue-500/10 to-transparent blur-3xl -z-10" />

          {/* Glow effect wrapper */}
          <div className="relative">
            {/* Multi-layer glow effects */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-3xl opacity-60 blur-xl" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 rounded-3xl opacity-40 blur-lg" />
            <div className="absolute -inset-[0.5px] bg-gradient-to-r from-purple-300 via-blue-300 to-cyan-300 rounded-3xl opacity-30 blur-md" />

            {/* Main container */}
            <div className="relative bg-zinc-950/80 backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-3 shadow-2xl">
              <div className="bg-zinc-900/60 rounded-t-2xl px-4 py-3 border-b border-white/[0.06] flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 bg-white/[0.02] rounded-lg text-xs text-zinc-600 font-mono">
                    loglens.app/dashboard
                  </div>
                </div>
              </div>

              <div className="relative aspect-[16/10] rounded-b-2xl overflow-hidden bg-black">
                <Image
                  src="/dashboard.png"
                  alt="LogLens Dashboard"
                  fill
                  className="object-cover object-top"
                  priority
                  quality={100}
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-20 left-0 w-full h-40 overflow-hidden pointer-events-none">
            <div className="absolute left-0 top-0 w-1/4 h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-transparent blur-xl opacity-60" />
            <div className="absolute right-0 top-0 w-1/3 h-2 bg-gradient-to-l from-blue-500 via-cyan-500 to-transparent blur-xl opacity-60" />
          </div>
        </motion.div>
      </section>

      {/* What Is LogLens Section */}
      <section id="what-is-loglens" className="relative py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-zinc-400 mb-6">
                WHAT IS LOGLENS?
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Your infrastructure's
                <br />
                intelligent observer.
              </h2>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                LogLens sits between your infrastructure and your engineers. It listens to logs, understands patterns, detects issues, and explains what's wrong—before users feel it.
              </p>
              <div className="space-y-4">
                {[
                  "Ingests logs from any source",
                  "Detects errors and anomalies automatically",
                  "Performs root-cause analysis with AI",
                  "Monitors production systems in real time"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl" />
              <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <Database className="w-6 h-6 text-blue-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">Apps & Services</div>
                      <div className="text-xs text-zinc-500">Microservices, APIs, Databases</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <Activity className="w-6 h-6 text-purple-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">LogLens AI Engine</div>
                      <div className="text-xs text-zinc-500">Pattern detection & analysis</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <BarChart3 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <div className="text-sm font-semibold text-white">Insights & Alerts</div>
                      <div className="text-xs text-zinc-500">Dashboards, notifications, reports</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-32 px-6 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-zinc-400 mb-6">
              HOW IT WORKS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              From logs to insights
              <br />
              in milliseconds.
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              A physical, system-level view of how LogLens processes your infrastructure data.
            </p>
          </div>

          {/* Visual Flow Diagram with Gradient Glow */}
          <div className="relative mb-16 py-20">
            {/* HIGHLY VISIBLE Gradient Glow Background */}
            <div className="absolute inset-0 flex items-center justify-center overflow-visible pointer-events-none">
              {/* Large visible gradient */}
              <div className="absolute w-full max-w-4xl h-64 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-emerald-600/40 blur-3xl" />
              <div className="absolute w-full max-w-3xl h-48 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-emerald-500/50 blur-2xl" />
              <div className="absolute w-full max-w-2xl h-32 bg-gradient-to-r from-blue-400/60 via-purple-400/60 to-emerald-400/60 blur-xl" />
            </div>

            {/* Flow Diagram */}
            <div className="relative flex items-center justify-center gap-4">
              {/* Step 1: Ingest */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Blue glow layers */}
                  <div className="absolute -inset-12 bg-blue-500/30 blur-3xl rounded-full" />
                  <div className="absolute -inset-8 bg-blue-400/40 blur-2xl rounded-full" />
                  <div className="absolute -inset-4 bg-blue-300/50 blur-xl rounded-full" />
                  <div className="relative w-20 h-20 rounded-2xl bg-blue-500/20 border-2 border-blue-400/70 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-blue-500/60">
                    <Database className="w-10 h-10 text-blue-200" style={{ filter: 'drop-shadow(0 0 10px rgba(147, 197, 253, 1))' }} />
                  </div>
                </div>
                <div className="text-xs font-semibold text-blue-400 mt-3">INGEST</div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-px bg-gradient-to-r from-blue-400 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                <ArrowRight className="w-4 h-4 text-purple-400 drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
              </div>

              {/* Step 2: Analyze */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Purple glow layers */}
                  <div className="absolute -inset-12 bg-purple-500/30 blur-3xl rounded-full" />
                  <div className="absolute -inset-8 bg-purple-400/40 blur-2xl rounded-full" />
                  <div className="absolute -inset-4 bg-purple-300/50 blur-xl rounded-full" />
                  <div className="relative w-20 h-20 rounded-2xl bg-purple-500/20 border-2 border-purple-400/70 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-purple-500/60">
                    <Activity className="w-10 h-10 text-purple-200" style={{ filter: 'drop-shadow(0 0 10px rgba(216, 180, 254, 1))' }} />
                  </div>
                </div>
                <div className="text-xs font-semibold text-purple-400 mt-3">ANALYZE</div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-px bg-gradient-to-r from-purple-400 to-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                <ArrowRight className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]" />
              </div>

              {/* Step 3: Alert */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Emerald glow layers */}
                  <div className="absolute -inset-12 bg-emerald-500/30 blur-3xl rounded-full" />
                  <div className="absolute -inset-8 bg-emerald-400/40 blur-2xl rounded-full" />
                  <div className="absolute -inset-4 bg-emerald-300/50 blur-xl rounded-full" />
                  <div className="relative w-20 h-20 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/70 flex items-center justify-center backdrop-blur-sm shadow-2xl shadow-emerald-500/60">
                    <Bell className="w-10 h-10 text-emerald-200" style={{ filter: 'drop-shadow(0 0 10px rgba(110, 231, 183, 1))' }} />
                  </div>
                </div>
                <div className="text-xs font-semibold text-emerald-400 mt-3">ALERT</div>
              </div>
            </div>
          </div>

          {/* Detail Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1: Ingest */}
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/5 blur-2xl" />
              <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 h-full">
                <div className="text-xs font-mono text-zinc-600 mb-4">01</div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Database className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Ingest</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Logs stream in from microservices, APIs, databases, and cloud infrastructure.
                </p>
              </div>
            </div>

            {/* Card 2: Analyze */}
            <div className="relative">
              <div className="absolute -inset-4 bg-purple-500/5 blur-2xl" />
              <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 h-full">
                <div className="text-xs font-mono text-zinc-600 mb-4">02</div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Analyze</h3>
                <p className="text-zinc-400 leading-relaxed">
                  AI engine detects patterns, groups errors, and performs root cause inference in real time.
                </p>
              </div>
            </div>

            {/* Card 3: Alert */}
            <div className="relative">
              <div className="absolute -inset-4 bg-emerald-500/5 blur-2xl" />
              <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 h-full">
                <div className="text-xs font-mono text-zinc-600 mb-4">03</div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6">
                  <Bell className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Alert</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Dashboards update, alerts fire, and insights are delivered before issues escalate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="relative py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-zinc-400 mb-6">
              CORE FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built for modern infrastructure
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Real-time intelligence, automatic insights, and production-grade reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Zap,
                title: "Real-time Log Ingestion",
                description: "Stream logs from any source with sub-second latency. Support for JSON, syslog, and custom formats.",
                color: "blue"
              },
              {
                icon: Activity,
                title: "Automatic Root Cause Analysis",
                description: "AI-powered pattern detection identifies issues and traces them to their source automatically.",
                color: "purple"
              },
              {
                icon: Bell,
                title: "Intelligent Alerts",
                description: "Smart notifications that reduce noise and surface only what matters. Slack, PagerDuty, email integrations.",
                color: "emerald"
              },
              {
                icon: BarChart3,
                title: "Production Analytics Dashboards",
                description: "Real-time visualizations, custom queries, and team collaboration tools for DevOps and SRE teams.",
                color: "amber"
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative p-8 rounded-2xl bg-zinc-900/40 border border-white/[0.08] backdrop-blur-sm transition-all duration-300 hover:bg-zinc-900/60 hover:border-white/[0.12] hover:-translate-y-1"
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-white/[0.1]">
                  <feature.icon className="w-6 h-6 text-zinc-400 transition-colors duration-300 group-hover:text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-32 px-6 bg-white/[0.01]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <div className="inline-block px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-zinc-400 mb-6">
              PRICING
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Start free, scale as you grow
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Transparent pricing for teams of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Free",
                price: "$0",
                description: "Perfect for side projects and testing",
                features: [
                  "1M logs/month",
                  "7-day retention",
                  "Basic analytics",
                  "Community support"
                ]
              },
              {
                name: "Pro",
                price: "$49",
                description: "For growing teams and startups",
                features: [
                  "100M logs/month",
                  "30-day retention",
                  "Advanced analytics",
                  "Priority support",
                  "Custom integrations"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large-scale production systems",
                features: [
                  "Unlimited logs",
                  "Custom retention",
                  "Dedicated infrastructure",
                  "24/7 support",
                  "SLA guarantee"
                ]
              }
            ].map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-2xl border ${plan.popular ? 'bg-white/[0.04] border-white/[0.12]' : 'bg-white/[0.02] border-white/[0.08]'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-purple-500 text-xs font-semibold text-white">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-sm font-semibold text-zinc-400 mb-2">{plan.name}</div>
                <div className="text-4xl font-bold text-white mb-2">{plan.price}</div>
                <div className="text-sm text-zinc-500 mb-6">{plan.description}</div>
                <Button className={`w-full h-11 rounded-xl font-semibold text-sm mb-6 ${plan.popular ? 'bg-white text-black hover:bg-zinc-100' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                  {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-zinc-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Built for production systems
          </h2>
          <p className="text-lg text-zinc-400 mb-12">
            Designed with DevOps and SRE workflows in mind.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, text: "Secure by default" },
              { icon: TrendingUp, text: "Scales with infrastructure" },
              { icon: Activity, text: "99.9% uptime SLA" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/[0.06] flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-zinc-300 font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-6 bg-white/[0.01]">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to decode your infrastructure?
          </h2>
          <p className="text-lg text-zinc-400 mb-12">
            Start analyzing logs in under 5 minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-100 rounded-full font-semibold text-sm shadow-2xl">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" className="h-12 px-8 border-white/20 text-white hover:bg-white/5 rounded-full font-semibold text-sm">
                Schedule Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 border-t border-white/[0.08]">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                  <span className="text-black font-bold text-sm">L</span>
                </div>
                <span className="font-bold text-lg">LogLens</span>
              </div>
              <p className="text-sm text-zinc-500">
                Infrastructure intelligence, decoded in real time.
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-4">Product</div>
              <div className="space-y-3">
                <Link href="#features" className="block text-sm text-zinc-500 hover:text-white transition-colors">Features</Link>
                <Link href="#pricing" className="block text-sm text-zinc-500 hover:text-white transition-colors">Pricing</Link>
                <Link href="#docs" className="block text-sm text-zinc-500 hover:text-white transition-colors">Docs</Link>
                <Link href="#status" className="block text-sm text-zinc-500 hover:text-white transition-colors">Status</Link>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-4">Company</div>
              <div className="space-y-3">
                <Link href="#about" className="block text-sm text-zinc-500 hover:text-white transition-colors">About</Link>
                <Link href="#blog" className="block text-sm text-zinc-500 hover:text-white transition-colors">Blog</Link>
                <Link href="#careers" className="block text-sm text-zinc-500 hover:text-white transition-colors">Careers</Link>
                <Link href="#contact" className="block text-sm text-zinc-500 hover:text-white transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-white mb-4">Legal</div>
              <div className="space-y-3">
                <Link href="#privacy" className="block text-sm text-zinc-500 hover:text-white transition-colors">Privacy</Link>
                <Link href="#terms" className="block text-sm text-zinc-500 hover:text-white transition-colors">Terms</Link>
                <Link href="#security" className="block text-sm text-zinc-500 hover:text-white transition-colors">Security</Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-white/[0.06] text-center text-sm text-zinc-600">
            © 2026 LogLens. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

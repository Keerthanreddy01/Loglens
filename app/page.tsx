"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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

      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif leading-[1.1] mb-8"
          >
            Coupled with{" "}
            <em className="font-serif italic">intelligent</em> tools
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12"
          >
            Complete any log analysis task in just a few clicks.
          </motion.p>

          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-20">
            {/* AI Pattern Detection Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 border border-white/10 p-8 hover:border-white/20 transition-all"
            >
              {/* Mock Dashboard Content */}
              <div className="mb-6 rounded-2xl bg-black/40 p-4 border border-white/5">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20">
                      <Terminal className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-zinc-500">AI Detection</div>
                      <div className="text-sm font-semibold">Active</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600" />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20">
                      <Shield className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-zinc-500">Pattern Match</div>
                      <div className="text-sm font-semibold">$1,024.87</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600" />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/20">
                      <BarChart3 className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-zinc-500">Analytics</div>
                      <div className="text-sm font-semibold">$5,242.13</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600" />
                  </div>

                  <div className="flex items-center gap-3 opacity-50">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800">
                      <Sparkles className="w-4 h-4 text-zinc-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-zinc-500">Insights</div>
                      <div className="text-sm font-semibold">$14,521.38</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600" />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">Smart Detection.</h3>
              <p className="text-sm text-zinc-500">
                AI automatically identifies critical errors and patterns in real-time.
              </p>
            </motion.div>

            {/* Real-time Analytics Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 border border-white/10 p-8 hover:border-white/20 transition-all"
            >
              {/* Mock Analytics Chart */}
              <div className="mb-6 rounded-2xl bg-black/40 p-4 border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs text-zinc-500">Total spend</div>
                  <div className="text-xs text-zinc-600">This week</div>
                </div>
                <div className="text-3xl font-bold mb-4">$68,026.43</div>

                {/* Mini chart bars */}
                <div className="flex items-end gap-2 h-24">
                  {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-amber-600/40 to-amber-400/60"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">Analytics.</h3>
              <p className="text-sm text-zinc-500">
                Get real-time insights and financial trends for each log stream.
              </p>
            </motion.div>

            {/* Auto Processing Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 border border-white/10 p-8 hover:border-white/20 transition-all"
            >
              {/* Mock Auto Transfer UI */}
              <div className="mb-6 rounded-2xl bg-black/40 p-6 border border-white/5">
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-2">
                      <Zap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div className="text-xs font-medium">Live</div>
                    <div className="text-xs text-zinc-600">$420,584.04</div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-amber-500" />

                  <div className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-2">
                      <Terminal className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-xs font-medium">Archive</div>
                    <div className="text-xs text-zinc-600">$2,134.01</div>
                  </div>
                </div>

                <div className="text-center pt-3 border-t border-white/5">
                  <div className="text-xs text-amber-500 font-medium mb-1">⚡ Processing active</div>
                  <div className="text-xs text-zinc-600">Auto top-up enabled</div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-2">Auto Processing.</h3>
              <p className="text-sm text-zinc-500">
                Automatic log processing when volume increases.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Second Hero Section */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif leading-[1.1] mb-8"
          >
            A <em className="italic">strong</em> financial
            <br />
            foundation
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-20"
          >
            High-performance log analysis, AI-powered insights for engineering teams,
            and flexible infrastructure to fuel your development.
          </motion.p>

          {/* Product Showcase */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 3D Shield Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 border border-white/10 p-12 flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/20 via-transparent to-transparent" />
              {/* 3D Shield mockup */}
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-zinc-900/20 rounded-[3rem] blur-3xl" />
                <div className="relative w-full h-full rounded-[3rem] bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 flex items-center justify-center">
                  <Shield className="w-32 h-32 text-amber-500/40" />
                </div>
              </div>
            </motion.div>

            {/* Credit Approved Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative aspect-square rounded-3xl bg-gradient-to-b from-zinc-900/50 to-zinc-950/50 border border-white/10 p-12 flex flex-col justify-center overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-transparent to-transparent" />

              <div className="relative space-y-8">
                {/* Toast Notification */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-emerald-400">Analysis complete!</span>
                </div>

                {/* Large Number Display */}
                <div>
                  <div className="text-6xl font-bold mb-2">$90,000.00</div>
                  <button className="text-sm text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                    View details <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Auto-Pay Toggle */}
                <div className="rounded-2xl bg-black/40 border border-white/5 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Processing Auto-Run</span>
                    <div className="w-12 h-7 rounded-full bg-emerald-500 relative">
                      <div className="absolute right-1 top-1 w-5 h-5 rounded-full bg-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Next run:</span>
                      <span>April, 05</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-500">Estimated cost:</span>
                      <span className="font-semibold">$3,750</span>
                    </div>
                    <div className="mt-3 h-1 rounded-full bg-zinc-800">
                      <div className="h-full w-1/3 rounded-full bg-emerald-500" />
                    </div>
                    <div className="text-xs text-zinc-600">Processing progress</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif leading-[1.1] mb-8 text-center max-w-4xl mx-auto"
          >
            A <em className="italic">higher standard</em>
            <br />
            in log intelligence
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-zinc-400 max-w-3xl mx-auto mb-20 text-center"
          >
            Analysis, search, patterns,{" "}
            <sup className="text-xs">1</sup> insights,{" "}
            <sup className="text-xs">4</sup> anomalies,{" "}
            <sup className="text-xs">6</sup> and more. All on one platform.
          </motion.p>

          {/* Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950"
          >
            {/* Top Bar */}
            <div className="border-b border-white/5 bg-black/40 backdrop-blur-xl">
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-6">
                  <div className="text-sm font-medium">LogLens</div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <button className="hover:text-white transition-colors">Home</button>
                    <button className="hover:text-white transition-colors">Cards</button>
                    <button className="hover:text-white transition-colors">Transactions</button>
                    <button className="hover:text-white transition-colors">Payments</button>
                    <button className="hover:text-white transition-colors">Accounts</button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-800" />
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="grid md:grid-cols-[300px_1fr_300px]">
              {/* Left Sidebar */}
              <div className="border-r border-white/5 bg-black/20 p-6 space-y-6">
                <div>
                  <div className="text-xs text-zinc-600 uppercase tracking-wider mb-3">Navigation</div>
                  <div className="space-y-1">
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                      Home
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                      Cards
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm bg-white/5 text-white">
                      Transactions
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                      Payments
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                      Accounts
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-zinc-600 uppercase tracking-wider mb-3">Add-ons</div>
                  <div className="space-y-1">
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                      Virtual Accounts
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                      Invoicing
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
                      Analytics
                    </button>
                  </div>
                </div>
              </div>

              {/* Center Content */}
              <div className="p-8">
                {/* Balance Card with Chart */}
                <div className="rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border border-white/10 p-6 mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">Current balance</div>
                      <div className="text-4xl font-bold">$1,652,342<span className="text-zinc-600">.90</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-lg text-xs bg-white/10 text-white">Balance</button>
                      <button className="px-3 py-1 rounded-lg text-xs text-zinc-500">Card Spend</button>
                      <button className="px-3 py-1 rounded-lg text-xs text-zinc-500 flex items-center gap-1">
                        This Week <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Area Chart with Gradient */}
                  <div className="relative h-40">
                    <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="rgb(217, 119, 6)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="rgb(217, 119, 6)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,120 L75,100 L150,80 L225,40 L300,60 L375,30 L450,50 L525,70 L600,90"
                        fill="url(#chartGradient)"
                        stroke="rgb(217, 119, 6)"
                        strokeWidth="2"
                      />
                    </svg>
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-zinc-600">
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>
                      <span>SUN</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-zinc-500">Available to spend</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-semibold">$1,000,000.00</span>
                      <ChevronDown className="w-4 h-4 text-zinc-600" />
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-2xl bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border border-white/10 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500">Group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500">Spend Limits</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="px-6 py-4 text-sm">Affiliate Platform</td>
                        <td className="px-6 py-4 text-sm">$800,000.00</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="px-6 py-4 text-sm">Marketing</td>
                        <td className="px-6 py-4 text-sm">$300,000.00</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="px-6 py-4 text-sm">Office Supplies</td>
                        <td className="px-6 py-4 text-sm">No Limit</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-800 text-zinc-500 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                            Paused
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm">Team Expenses</td>
                        <td className="px-6 py-4 text-sm">No Limit</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-800 text-zinc-500 text-xs">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                            Paused
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="border-l border-white/5 bg-black/20 p-6">
                <div className="text-sm font-medium mb-4">Transactions</div>
                <div className="space-y-4">
                  {[
                    { name: "Amazon Associates", amount: "-$7,890.21", type: "Card Transaction", category: "Affiliate" },
                    { name: "Etsy Partner Network", amount: "$34,993.71", type: "Inbound ACH Credit", category: "" },
                    { name: "Meta Platforms Inc.", amount: "-$12,287.83", type: "Card Transaction", category: "Facebook Ads" },
                    { name: "Adobe Inc.", amount: "-$2,056.87", type: "Card Transaction", category: "Design Assets" },
                    { name: "Stripe Affiliate Program", amount: "$6,435.54", type: "Inbound ACH Credit", category: "ACH" },
                  ].map((tx, i) => (
                    <div key={i} className="flex items-start gap-3 pb-4 border-b border-white/5 last:border-0">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">
                          {tx.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{tx.name}</div>
                        <div className="text-xs text-zinc-500">{tx.type}</div>
                        {tx.category && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400">
                              {tx.category}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className={`text-sm font-semibold ${tx.amount.startsWith('-') ? 'text-red-400' : 'text-amber-400'}`}>
                        {tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <input
              type="email"
              placeholder="What's your email?"
              className="w-full max-w-md px-6 py-4 rounded-full bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20"
            />
          </div>
          <Button className="h-12 px-8 bg-white text-black hover:bg-zinc-200 rounded-full font-medium">
            Get Started
          </Button>
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
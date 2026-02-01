"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  Terminal,
  Search,
  Bell,
  Filter,
  Clock,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

// Ambient background with soft gradient glows
function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Primary glow - top left */}
      <div 
        className="absolute -top-[300px] -left-[300px] h-[800px] w-[800px] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(0, 112, 243, 0.15) 0%, transparent 70%)",
        }}
      />
      {/* Secondary glow - center right */}
      <div 
        className="absolute top-1/3 -right-[200px] h-[600px] w-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
        }}
      />
      {/* Subtle center glow */}
      <div 
        className="absolute top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 50%)",
        }}
      />
      {/* Grid overlay for depth */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />
    </div>
  );
}

// Navigation link component with proper accessibility
function NavLink({ 
  href, 
  children, 
  external = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  external?: boolean;
}) {
  const baseClasses = "text-sm text-zinc-400 transition-colors duration-200 hover:text-white focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm px-1 py-0.5";
  
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
        {children}
      </a>
    );
  }
  
  return (
    <Link href={href} className={baseClasses}>
      {children}
    </Link>
  );
}

// Glass card with subtle depth
function GlassCard({ 
  children, 
  className = "", 
  hover = true,
  glow = false,
}: { 
  children: React.ReactNode; 
  className?: string; 
  hover?: boolean;
  glow?: boolean;
}) {
  return (
    <div className="relative">
      {glow && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      )}
      <div
        className={`
          relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl
          ${hover ? "transition-all duration-300 hover:border-white/[0.12] hover:bg-[#0a0a0a]/90" : ""}
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}

// Animated log line for mockup
function AnimatedLogLine({ 
  delay, 
  level, 
  service, 
  message, 
  highlight = false 
}: { 
  delay: number; 
  level: string; 
  service: string; 
  message: string; 
  highlight?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const levelColors: Record<string, string> = {
    INFO: "bg-[#0070f3]/20 text-[#0070f3]",
    WARN: "bg-amber-500/20 text-amber-400",
    ERROR: "bg-red-500/20 text-red-400",
    DEBUG: "bg-zinc-500/20 text-zinc-400",
  };

  return (
    <div
      className={`
        flex items-center gap-3 py-1.5 px-2 rounded font-mono text-[12px] transition-all duration-500
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
        ${highlight ? "bg-white/[0.02]" : ""}
      `}
    >
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${levelColors[level]}`}>
        {level}
      </span>
      <span className="text-[#0070f3]">[{service}]</span>
      <span className="text-zinc-500 truncate">{message}</span>
    </div>
  );
}

// Dashboard mockup with 3D tilt effect
function DashboardMockup() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 40;
      const y = (e.clientY - rect.top - rect.height / 2) / 40;
      setMousePos({ x, y });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className="relative"
      style={{ perspective: "2000px" }}
    >
      {/* Outer glow */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-b from-[#0070f3]/10 via-transparent to-transparent blur-2xl" />

      {/* Main frame */}
      <div
        className="relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <GlassCard className="overflow-hidden shadow-2xl shadow-black/50" hover={false}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/[0.04] bg-[#0a0a0a] px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className="ml-4 flex-1">
              <div className="mx-auto max-w-sm rounded-md bg-white/[0.04] px-3 py-1 text-[11px] text-zinc-600 text-center">
                app.loglens.dev/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard layout */}
          <div className="flex bg-[#050505]">
            {/* Sidebar */}
            <div className="hidden w-44 border-r border-white/[0.04] p-3 sm:block">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0070f3]">
                  <BarChart3 className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">LogLens</span>
              </div>
              <nav className="space-y-0.5">
                {[
                  { icon: BarChart3, label: "Overview", active: true },
                  { icon: Terminal, label: "Live Logs", active: false },
                  { icon: Search, label: "Search", active: false },
                  { icon: Bell, label: "Alerts", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] ${
                      item.active
                        ? "bg-[#0070f3]/10 text-[#0070f3]"
                        : "text-zinc-600"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-3">
              {/* Stats */}
              <div className="mb-3 grid grid-cols-4 gap-2">
                {[
                  { label: "Total Logs", value: "1.2M", change: "+12%", positive: true },
                  { label: "Error Rate", value: "0.04%", change: "-2%", positive: true },
                  { label: "P99 Latency", value: "142ms", change: "+4ms", positive: false },
                  { label: "Alerts", value: "2", change: "", positive: true },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-md bg-white/[0.02] p-2">
                    <p className="text-[9px] uppercase tracking-wider text-zinc-600">{stat.label}</p>
                    <p className="text-sm font-semibold text-white">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-[9px] ${stat.positive ? "text-emerald-500" : "text-amber-500"}`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Chart */}
              <div className="mb-3 rounded-md bg-white/[0.02] p-3">
                <p className="mb-2 text-[11px] font-medium text-zinc-400">Log Frequency</p>
                <div className="flex h-16 items-end gap-0.5">
                  {[35, 45, 30, 60, 80, 50, 40, 70, 55, 45, 65, 75, 50, 35, 55, 60, 40, 50, 60, 45, 55, 70, 50, 40].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-[#0070f3]/30 to-[#0070f3]/70"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Log stream */}
              <div className="rounded-md bg-white/[0.02] p-2">
                <div className="mb-1.5 flex items-center gap-2">
                  <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-medium text-zinc-400">Live Stream</span>
                </div>
                <div className="space-y-0">
                  <AnimatedLogLine delay={0} level="INFO" service="api" message="GET /v1/user/profile 200 (45ms)" />
                  <AnimatedLogLine delay={150} level="ERROR" service="auth" message="ConnectionTimeout: Redis" highlight />
                  <AnimatedLogLine delay={300} level="WARN" service="db" message="Slow query (240ms)" />
                  <AnimatedLogLine delay={450} level="INFO" service="api" message="POST /v1/auth/login 200 (112ms)" />
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="hidden w-48 border-l border-white/[0.04] p-3 lg:block">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">AI Insight</p>
              <div className="rounded-md bg-gradient-to-br from-[#0070f3]/10 to-transparent p-2">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#0070f3]" />
                  <span className="text-[10px] font-medium text-zinc-300">Pattern Detected</span>
                </div>
                <p className="text-[10px] leading-relaxed text-zinc-500">
                  14% spike in <span className="text-red-400">500 errors</span> from api-gateway
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// Feature card
function FeatureCard({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
}) {
  return (
    <div className="group relative">
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <GlassCard className="relative p-6" hover={false}>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#0070f3]/15 to-[#0070f3]/5">
          <Icon className="h-5 w-5 text-[#0070f3]" />
        </div>
        <h3 className="mb-2 text-base font-semibold text-white">{title}</h3>
        <p className="text-sm leading-relaxed text-zinc-500">{description}</p>
      </GlassCard>
    </div>
  );
}

// Company logo
function CompanyLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-zinc-600 transition-colors duration-200 hover:text-zinc-400">
      <svg className="h-4 w-4" viewBox="0 0 76 65" fill="currentColor">
        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
      </svg>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}

// AI Feature showcase
function AIFeatureShowcase() {
  const [selectedAgent, setSelectedAgent] = useState(0);
  const agents = [
    { name: "Pattern Detection", tag: "AI", checked: true },
    { name: "Anomaly Alerts", tag: "ML", checked: false },
    { name: "Log Correlation", tag: "AI", checked: false },
  ];

  return (
    <GlassCard className="overflow-hidden">
      <div className="p-4">
        <p className="mb-3 text-sm italic text-zinc-600">Assign to...</p>
        <div className="space-y-1">
          {agents.map((agent, i) => (
            <button
              key={agent.name}
              onClick={() => setSelectedAgent(i)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left transition-all duration-200 ${
                selectedAgent === i
                  ? "bg-white/[0.04]"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className={`h-4 w-4 ${selectedAgent === i ? "text-[#0070f3]" : "text-zinc-600"}`} />
                <span className={`text-sm font-medium ${selectedAgent === i ? "text-white" : "text-zinc-400"}`}>
                  {agent.name}
                </span>
                <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-zinc-500">
                  {agent.tag}
                </span>
              </div>
              {selectedAgent === i && (
                <svg className="h-4 w-4 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

// Code block showcase
function CodeBlockShowcase() {
  return (
    <GlassCard className="overflow-hidden">
      <div className="border-b border-white/[0.04] px-4 py-2.5">
        <span className="text-[11px] text-zinc-600">//mcp.loglens.dev/sse</span>
      </div>
      <div className="p-4 font-mono text-[13px]">
        <div className="text-zinc-500">
          <span className="text-[#0070f3]">{'"mcpServers"'}</span>: {"{"}
        </div>
        <div className="ml-4 text-zinc-500">
          <span className="text-amber-400">{'"loglens"'}</span>: {"{"}
        </div>
        <div className="ml-8 text-zinc-500">
          <span className="text-amber-400">{'"command"'}</span>: <span className="text-emerald-400">{'"npx"'}</span>
        </div>
        <div className="ml-4 text-zinc-500">{"}"}</div>
        <div className="text-zinc-500">{"}"}</div>
      </div>
      <div className="border-t border-white/[0.04] p-4">
        <div className="mb-3 flex items-center gap-2 text-sm text-zinc-500">
          <span className="border-l-2 border-[#0070f3] pl-3">Ask anything</span>
        </div>
        <div className="flex gap-2">
          {[
            { label: "Attach", icon: Filter },
            { label: "Search", icon: Search },
            { label: "Reason", icon: Clock },
          ].map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-1.5 rounded-md border border-white/[0.06] px-2.5 py-1.5 text-[11px] text-zinc-500 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.02] hover:text-zinc-300"
            >
              <action.icon className="h-3 w-3" />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <AmbientBackground />

      {/* Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrollY > 20 ? "border-b border-white/[0.04] bg-black/90 backdrop-blur-xl" : ""
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0070f3] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white">
              <BarChart3 className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-base font-semibold">LogLens</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="https://docs.loglens.dev" external>Docs</NavLink>
            <NavLink href="https://github.com/loglens" external>GitHub</NavLink>
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <NavLink href="/login">Log in</NavLink>
            <Link href="/dashboard">
              <Button 
                size="sm"
                className="bg-white text-black font-medium hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-[#0070f3] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-white md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/[0.04] bg-black/95 backdrop-blur-xl md:hidden">
            <div className="space-y-1 px-4 py-4">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "Docs", href: "https://docs.loglens.dev" },
                { label: "GitHub", href: "https://github.com/loglens" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2 pt-4 border-t border-white/[0.04]">
                <Link href="/login" className="block rounded-md px-3 py-2 text-sm text-zinc-400 hover:text-white">
                  Log in
                </Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white text-black hover:bg-zinc-100">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - positioned higher, not centered */}
      <section className="relative px-4 pt-28 sm:px-6 sm:pt-32 lg:pt-40">
        <div className="mx-auto max-w-4xl">
          {/* Announcement badge */}
          <div className="mb-6 flex justify-center">
            <Link
              href="#ai-features"
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 text-sm transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                New
              </span>
              <span className="text-zinc-400">AI-powered pattern detection</span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Headline */}
          <div className="text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.1]">
              <span className="text-white">Ship faster.</span>
              <br />
              <span className="bg-gradient-to-r from-zinc-400 to-zinc-600 bg-clip-text text-transparent">
                Debug smarter.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-xl text-base text-zinc-500 sm:text-lg sm:leading-relaxed">
              The modern platform for teams who ship fast. Built for scale, 
              designed for speed. Everything you need to analyze, debug, and grow.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="h-11 gap-2 bg-white px-6 text-black font-medium hover:bg-zinc-100"
                >
                  Start Building
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-11 border-white/[0.08] bg-transparent text-white hover:bg-white/[0.04]"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div className="mx-auto mt-16 max-w-5xl px-2 sm:mt-20 sm:px-4 lg:mt-24">
          <DashboardMockup />
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 border-t border-white/[0.04]" />
          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {/* Left feature */}
            <div>
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                Self-driving log analysis
              </h2>
              <p className="mb-6 text-base text-zinc-500">
                Streamline your debugging workflows with AI assistance for routine, manual tasks.
              </p>
              <AIFeatureShowcase />
            </div>

            {/* Right feature */}
            <div>
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                LogLens MCP
              </h2>
              <p className="mb-6 text-base text-zinc-500">
                Connect LogLens to your favorite tools including Cursor, Claude, and ChatGPT.
              </p>
              <CodeBlockShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="mb-2 text-sm font-medium text-white">
            Powering the world's best engineering teams.
          </p>
          <p className="mb-10 text-sm text-zinc-600">
            From next-gen startups to established enterprises.
          </p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
            {["Vercel", "Stripe", "Linear", "Notion", "Figma", "GitHub", "Slack", "Discord"].map((company) => (
              <CompanyLogo key={company} name={company} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai-features" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 border-t border-white/[0.04]" />
          <div className="max-w-xl">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              AI-assisted<br />log debugging
            </h2>
            <p className="mb-6 text-base text-zinc-500 sm:text-lg">
              <span className="font-medium text-white">LogLens for Agents.</span>{" "}
              Choose from a variety of AI agents and start delegating work, from pattern detection to root cause analysis.
            </p>
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="gap-2 border-white/[0.08] bg-transparent text-white hover:bg-white/[0.04]"
              >
                Learn more
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section id="pricing" className="relative py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Sparkles}
              title="AI Pattern Detection"
              description="Automatically group similar errors and identify anomalies using advanced pattern recognition."
            />
            <FeatureCard
              icon={Zap}
              title="Zero Infrastructure"
              description="Runs entirely in your browser. No servers, no databases, no setup. Just paste and analyze."
            />
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Your logs never leave your browser. All processing happens locally with complete privacy."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to debug faster?
          </h2>
          <p className="mb-8 text-base text-zinc-500 sm:text-lg">
            Start analyzing your logs in seconds. No signup required.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="h-12 gap-2 bg-white px-8 text-black font-medium hover:bg-zinc-100">
              Enter Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded bg-white">
                <BarChart3 className="h-2.5 w-2.5 text-black" />
              </div>
              <span className="text-sm text-zinc-600">
                LogLens
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {[
                { label: "Twitter", href: "https://twitter.com/loglens" },
                { label: "GitHub", href: "https://github.com/loglens" },
                { label: "Discord", href: "https://discord.gg/loglens" },
                { label: "Docs", href: "https://docs.loglens.dev" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-300"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

// Floating orb background component
function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-[#0070f3]/5 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-[#0070f3]/3 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7928ca]/3 blur-[80px]" />
    </div>
  );
}

// Parallax section wrapper
function ParallaxSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.innerHeight - rect.top;
        setOffset(scrolled * 0.05);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={ref} className={className} style={{ transform: `translateY(${offset}px)` }}>
      {children}
    </div>
  );
}

// Glass card component
function GlassCard({ children, className = "", hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div
      className={`
        relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl
        ${hover ? "transition-all duration-500 hover:border-white/[0.15] hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-[#0070f3]/5" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Animated log line for mockups
function AnimatedLogLine({ delay, level, service, message, highlight = false }: { delay: number; level: string; service: string; message: string; highlight?: boolean }) {
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
        flex items-center gap-3 py-2 px-3 rounded-lg font-mono text-[13px] transition-all duration-500
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}
        ${highlight ? "bg-white/[0.03]" : ""}
      `}
    >
      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${levelColors[level]}`}>
        {level}
      </span>
      <span className="text-[#0070f3]">[{service}]</span>
      <span className="text-zinc-400 truncate">{message}</span>
    </div>
  );
}

// Dashboard mockup component
function DashboardMockup() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 25;
      const y = (e.clientY - rect.top - rect.height / 2) / 25;
      setMousePos({ x, y });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className="relative perspective-[2000px] cursor-pointer"
    >
      {/* Glow effect */}
      <div className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-[#0070f3]/20 via-transparent to-[#7928ca]/20 blur-3xl opacity-50" />

      {/* Main dashboard frame */}
      <div
        className="relative transition-transform duration-300 ease-out"
        style={{
          transform: `rotateY(${mousePos.x}deg) rotateX(${-mousePos.y}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <GlassCard className="overflow-hidden" hover={false}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
            </div>
            <div className="ml-4 flex-1">
              <div className="mx-auto max-w-md rounded-lg bg-white/[0.05] px-4 py-1.5 text-xs text-zinc-500">
                app.loglens.dev/dashboard
              </div>
            </div>
          </div>

          {/* Dashboard content */}
          <div className="flex">
            {/* Sidebar */}
            <div className="w-48 border-r border-white/[0.06] p-4">
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0070f3]">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-white">LogLens</span>
              </div>
              <nav className="space-y-1">
                {[
                  { icon: BarChart3, label: "Overview", active: true },
                  { icon: Terminal, label: "Live Logs", active: false },
                  { icon: Search, label: "Search", active: false },
                  { icon: Bell, label: "Alerts", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                      item.active
                        ? "bg-[#0070f3]/10 text-[#0070f3]"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-4">
              {/* Stats row */}
              <div className="mb-4 grid grid-cols-4 gap-3">
                {[
                  { label: "Total Logs", value: "1.2M", change: "+12%" },
                  { label: "Error Rate", value: "0.04%", change: "-2%" },
                  { label: "P99 Latency", value: "142ms", change: "+4ms" },
                  { label: "Active Alerts", value: "2", change: "" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-white/[0.02] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">{stat.label}</p>
                    <p className="text-lg font-semibold text-white">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-[10px] ${stat.change.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div className="mb-4 rounded-lg bg-white/[0.02] p-4">
                <p className="mb-3 text-sm font-medium text-zinc-300">Log Frequency</p>
                <div className="flex h-20 items-end gap-1">
                  {[40, 55, 35, 70, 90, 60, 45, 80, 65, 50, 75, 85, 55, 40, 60, 70, 45, 55, 65, 50].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-gradient-to-t from-[#0070f3]/40 to-[#0070f3]/80 transition-all hover:from-[#0070f3]/60 hover:to-[#0070f3]"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Log stream */}
              <div className="rounded-lg bg-white/[0.02] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-xs font-medium text-zinc-300">Live Stream</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="rounded bg-white/[0.05] px-2 py-0.5 text-[10px] text-zinc-400">Compact</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <AnimatedLogLine delay={0} level="INFO" service="api" message="GET /v1/user/profile 200 OK (45ms)" />
                  <AnimatedLogLine delay={200} level="ERROR" service="auth" message="ConnectionTimeoutError: Failed to connect" highlight />
                  <AnimatedLogLine delay={400} level="WARN" service="db" message="Slow query detected (240ms)" />
                  <AnimatedLogLine delay={600} level="INFO" service="api" message="POST /v1/auth/login 200 OK (112ms)" />
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="w-56 border-l border-white/[0.06] p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">AI Insight</p>
              <div className="rounded-lg bg-gradient-to-br from-[#0070f3]/10 to-transparent p-3">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#0070f3]" />
                  <span className="text-xs font-medium text-zinc-300">Pattern Detected</span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-400">
                  Detected 14% spike in <span className="text-red-400">500 Internal Errors</span> from api-gateway-v2
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// Feature card for the features section
function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <GlassCard className="group p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0070f3]/20 to-[#0070f3]/5 transition-all group-hover:from-[#0070f3]/30 group-hover:to-[#0070f3]/10">
        <Icon className="h-6 w-6 text-[#0070f3]" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </GlassCard>
  );
}

// Company logo placeholder
function CompanyLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 text-zinc-500 opacity-50 transition-opacity hover:opacity-80">
      <div className="h-5 w-5">
        <svg viewBox="0 0 76 65" fill="currentColor">
          <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
        </svg>
      </div>
      <span className="font-semibold">{name}</span>
    </div>
  );
}

// AI Feature showcase
function AIFeatureShowcase() {
  const [selectedAgent, setSelectedAgent] = useState(0);
  const agents = [
    { name: "Pattern Detection", tag: "AI" },
    { name: "Anomaly Alerts", tag: "ML" },
    { name: "Log Correlation", tag: "AI" },
  ];

  return (
    <GlassCard className="p-1">
      <div className="rounded-xl bg-white/[0.02] p-4">
        <p className="mb-3 text-sm italic text-zinc-500">Assign to...</p>
        <div className="space-y-1">
          {agents.map((agent, i) => (
            <div
              key={agent.name}
              onClick={() => setSelectedAgent(i)}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 transition-all ${
                selectedAgent === i
                  ? "bg-white/[0.05]"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className={`h-4 w-4 ${selectedAgent === i ? "text-[#0070f3]" : "text-zinc-500"}`} />
                <span className={`font-medium ${selectedAgent === i ? "text-white" : "text-zinc-400"}`}>
                  {agent.name}
                </span>
                <span className="rounded bg-white/[0.1] px-2 py-0.5 text-[10px] text-zinc-400">
                  {agent.tag}
                </span>
              </div>
              {selectedAgent === i && (
                <svg className="h-5 w-5 text-[#0070f3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
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
      <div className="border-b border-white/[0.06] px-4 py-2">
        <span className="text-xs text-zinc-500">//mcp.loglens.dev/sse</span>
      </div>
      <div className="p-4 font-mono text-sm">
        <div className="text-zinc-400">
          <span className="text-[#0070f3]">{'"mcpServers"'}</span>: {"{"}
        </div>
        <div className="ml-4 text-zinc-400">
          <span className="text-amber-400">{'"loglens"'}</span>: {"{"}
        </div>
        <div className="ml-8 text-zinc-400">
          <span className="text-amber-400">{'"command"'}</span>: <span className="text-emerald-400">{'"npx"'}</span>
        </div>
        <div className="ml-4 text-zinc-400">{"}"}</div>
        <div className="text-zinc-400">{"}"}</div>
      </div>
      <div className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="border-l-2 border-[#0070f3] pl-3">Ask anything</span>
        </div>
        <div className="mt-3 flex gap-2">
          {["Attach", "Search", "Reason"].map((action) => (
            <button
              key={action}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-white/[0.2] hover:bg-white/[0.02]"
            >
              {action === "Attach" && <Filter className="h-3 w-3" />}
              {action === "Search" && <Search className="h-3 w-3" />}
              {action === "Reason" && <Clock className="h-3 w-3" />}
              {action}
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      <FloatingOrbs />

      {/* Navigation */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrollY > 50 ? "border-b border-white/[0.06] bg-black/80 backdrop-blur-xl" : ""
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                <BarChart3 className="h-4 w-4 text-black" />
              </div>
              <span className="text-lg font-semibold">LogLens</span>
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              {["Product", "Resources", "Pricing", "Docs"].map((item) => (
                <button key={item} className="text-sm text-zinc-400 transition-colors hover:text-white">
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden text-sm text-zinc-400 transition-colors hover:text-white sm:block">
              Log in
            </button>
            <Link href="/dashboard">
              <Button className="bg-white text-black hover:bg-zinc-200">
                Enter Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-16">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-balance text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            LogLens is a purpose-built tool for
            <br />
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              analyzing and debugging logs
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400 md:text-xl">
            Meet the system for modern DevOps teams.
            <br />
            Streamline logs, errors, and production insights.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200">
                Start analyzing
              </Button>
            </Link>
            <button className="flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white">
              <span>New:</span>
              <span className="font-medium text-white">AI-powered insights</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="mt-16 w-full max-w-5xl px-4 md:mt-20">
          <ParallaxSection>
            <DashboardMockup />
          </ParallaxSection>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 border-t border-white/[0.06]" />
          <div className="grid gap-8 md:grid-cols-2">
            {/* Left feature */}
            <div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Self-driving log analysis
              </h2>
              <p className="mb-8 text-lg text-zinc-400">
                Streamline your debugging workflows with AI
                <br />
                assistance for routine, manual tasks.
              </p>
              <AIFeatureShowcase />
            </div>

            {/* Right feature */}
            <div>
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                LogLens MCP
              </h2>
              <p className="mb-8 text-lg text-zinc-400">
                Connect LogLens to your favorite tools including Cursor,
                <br />
                Claude, ChatGPT, and more.
              </p>
              <CodeBlockShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="mb-4 text-lg font-medium text-white">
            Powering the world's best engineering teams.
          </p>
          <p className="mb-12 text-zinc-500">
            From next-gen startups to established enterprises.
          </p>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {["Vercel", "Stripe", "Linear", "Notion", "Figma", "GitHub", "Slack", "Discord"].map((company) => (
              <CompanyLogo key={company} name={company} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="relative py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 border-t border-white/[0.06]" />
          <div className="max-w-2xl">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
              AI-assisted log
              <br />
              debugging
            </h2>
            <p className="mb-8 text-lg text-zinc-400">
              <span className="font-medium text-white">LogLens for Agents.</span>{" "}
              Choose from a variety of AI agents and start delegating work, from pattern detection to root cause analysis.
            </p>
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2 border-white/[0.1] bg-transparent text-white hover:bg-white/[0.05]">
                Learn more
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={Sparkles}
              title="AI Pattern Detection"
              description="Automatically group similar errors and identify anomalies in your logs using advanced pattern recognition."
            />
            <FeatureCard
              icon={Zap}
              title="Zero Infrastructure"
              description="Runs entirely in your browser. No servers, no databases, no setup. Just paste your logs and go."
            />
            <FeatureCard
              icon={Shield}
              title="Privacy First"
              description="Your logs never leave your browser. All processing happens locally with complete data privacy."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to debug faster?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-zinc-400">
            Start analyzing your logs in seconds. No signup required.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 bg-white text-black hover:bg-zinc-200">
              Enter Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
                <BarChart3 className="h-3 w-3 text-black" />
              </div>
              <span className="text-sm text-zinc-500">
                LogLens - Built with v0
              </span>
            </div>
            <div className="flex items-center gap-8">
              {["Twitter", "GitHub", "Discord", "Documentation"].map((item) => (
                <button key={item} className="text-sm text-zinc-500 transition-colors hover:text-white">
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

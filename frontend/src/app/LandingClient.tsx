"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Terminal,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  Clock,
  Code,
  Layers,
  TrendingUp,
  Play,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import type { User } from '@workos-inc/node';

export default function LandingClient({ user }: { user: User | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const aiSectionRef = useRef<HTMLDivElement>(null);

  // Enhanced Spotlight Effect Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };

  const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div
      onMouseMove={handleMouseMove}
      className={`gold-spotlight-card rounded-[16px] ${className}`}
    >
      <div className="gold-dust" />
      <div className="relative z-10">{children}</div>
    </div>
  );

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Hero Entrance - Ultra smooth
      const heroTl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1.4 }
      });

      heroTl
        .from(".hero-badge", {
          y: 20,
          opacity: 0,
          scale: 0.95,
          duration: 1,
        })
        .from(".hero-title", {
          y: 30,
          opacity: 0,
          duration: 1.6,
        }, "-=0.8")
        .from(".hero-text", {
          y: 20,
          opacity: 0,
          duration: 1.2,
        }, "-=1.2")
        .from(".hero-btns", {
          y: 20,
          opacity: 0,
          duration: 1,
        }, "-=0.8")
        .from(".hero-stats", {
          opacity: 0,
          y: 15,
          duration: 1,
        }, "-=0.6");

      // 2. Dashboard Reveal with premium timing
      gsap.fromTo(
        dashboardRef.current,
        {
          opacity: 0,
          y: 60,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      // 3. Staggered section reveals
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        gsap.from(section.querySelectorAll(".reveal-item"), {
          y: 40,
          opacity: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            once: true,
          },
        });
      });

      // 4. Feature cards entrance
      gsap.from(".feature-card", {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%",
          once: true,
        },
      });

      // 5. Subtle parallax for depth
      gsap.to(".bg-gradient-1", {
        yPercent: -15,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      gsap.to(".bg-gradient-2", {
        yPercent: 20,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });

      // 6. Pricing cards reveal
      gsap.from(".pricing-card", {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".pricing-grid",
          start: "top 80%",
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-white selection:bg-violet-500/20 font-sans antialiased">
      {/* Enhanced Background System */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Premium grid with fade */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />


        {/* Animated Gradient Mesh - Aurora Effect */}
        <div className="gradient-mesh gradient-mesh-1" />
        <div className="gradient-mesh gradient-mesh-2" />
        <div className="gradient-mesh gradient-mesh-3" />

        {/* Floating particles with glow */}
        {[
          { top: '15%', left: '8%' },
          { top: '35%', left: '85%' },
          { top: '55%', left: '25%' },
          { top: '75%', left: '75%' },
          { top: '25%', left: '50%' },
        ].map((pos, i) => (
          <div
            key={i}
            className="particle absolute w-1 h-1 rounded-full"
            style={{
              top: pos.top,
              left: pos.left,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}

        {/* Noise texture */}
        <div className="noise-overlay" />
      </div>

      {/* Enhanced Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/[0.06] bg-black/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 duration-300">
              <div className="relative">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <div className="absolute inset-0 blur-lg bg-violet-400/20" />
              </div>
              <span className="text-lg font-semibold tracking-tight">LogLens</span>
            </Link>

            <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-zinc-400">
              {["Product", "Solutions", "Resources", "Pricing"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-white transition-colors duration-200 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-violet-400 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="hidden md:block text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-200">
                    Dashboard
                  </Link>
                  <Link href="/api/auth/logout">
                    <Button className="h-9 px-5 bg-white/5 text-white hover:bg-white/10 border border-white/10 rounded-lg text-[13px] font-medium transition-all duration-200">
                      Sign Out
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/api/auth/login" className="hidden md:block text-[13px] font-medium text-zinc-400 hover:text-white transition-colors duration-200">
                    Sign in
                  </Link>
                  <Link href="/api/auth/login">
                    <Button className="relative h-9 px-5 bg-white text-black hover:bg-white/90 rounded-lg text-[13px] font-semibold shadow-lg shadow-black/20 hover:shadow-violet-500/20 transition-all duration-300 hover:scale-[1.02]">
                      Get started
                      <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </>
              )}
              <button
                className="lg:hidden text-zinc-400 hover:text-white transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/98 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-6 border-b border-white/[0.06]">
              <Link href="/" className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span className="text-lg font-semibold">LogLens</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 space-y-8">
              {["Product", "Solutions", "Resources", "Pricing"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-3xl font-semibold text-zinc-400 hover:text-white transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>

            <div className="p-6 border-t border-white/[0.06]">
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full h-12 bg-white text-black rounded-xl text-base font-semibold">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Enhanced */}
      <section ref={heroRef} className="relative pt-24 pb-12 px-6 lg:px-8 min-h-[85vh] flex flex-col items-center justify-center">
        <div className="mx-auto max-w-5xl text-center flex flex-col items-center">
          {/* Premium badge */}
          <div className="hero-badge mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[13px] font-medium text-zinc-400">Production-ready observability</span>
          </div>

          {/* Hero headline with holographic effect */}
          <h1 className="hero-title text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[1.1] mb-6 tracking-[-0.02em] max-w-4xl">
            <span className="holographic-text">Infrastructure that</span>
            <br />
            <span className="holographic-text">tells a story</span>
          </h1>

          <p className="hero-text text-lg lg:text-xl text-zinc-500 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            Transform raw logs into beautiful, actionable insights. Built for teams who value clarity and speed.
          </p>

          {/* CTA Buttons */}
          <div className="hero-btns flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/dashboard">
              <Button className="group h-12 px-8 bg-white text-black hover:bg-white/90 rounded-xl text-[15px] font-semibold shadow-2xl shadow-black/30 hover:shadow-violet-500/30 transition-all duration-500 hover:scale-[1.02]">
                Start for free
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="#demo">
              <Button variant="outline" className="group h-12 px-8 border-white/[0.08] bg-white/[0.02] text-white hover:bg-white/[0.05] hover:border-white/[0.15] rounded-xl text-[15px] font-medium backdrop-blur-xl transition-all duration-300">
                <Play className="w-4 h-4 mr-2" />
                Watch demo
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats flex flex-wrap justify-center items-center gap-x-12 gap-y-6 pt-8 border-t border-white/[0.05]">
            {[
              { value: "5,000+", label: "Teams" },
              { value: "99.9%", label: "Uptime" },
              { value: "<100ms", label: "Response" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-2xl font-semibold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-zinc-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Linear-Style Product Showcase */}
        <div ref={dashboardRef} className="product-stage">
          <div className="stage-perspective">
            <div className="product-tilt">
              <div className="product-frame">
                {/* Browser Chrome */}
                <div className="flex items-center justify-between border-b border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/30" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                      <div className="w-2 h-2 rounded-full bg-violet-400/50 animate-pulse" />
                      <span className="text-xs text-zinc-500 font-medium">app.loglens.io</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
                    <div className="hidden sm:block h-2.5 w-10 rounded-full bg-white/[0.06]" />
                  </div>
                </div>

                {/* Dashboard Image */}
                <div className="relative aspect-[16/10]">
                  <img
                    src="/dashboard.png"
                    alt="LogLens Dashboard - Production observability platform"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned */}
      <section id="product" className="reveal-section relative py-20 lg:py-28 px-6 lg:px-8 border-t border-white/[0.04]">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 reveal-item">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
              Features
            </div>
            <h2 className="text-4xl lg:text-6xl font-semibold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Everything you need.
              <br />
              Nothing you don't.
            </h2>
            <p className="text-lg text-zinc-500 max-w-2xl font-light">
              Built with the tools that matter. Designed for the workflows that scale.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Zap,
                title: "Lightning fast",
                desc: "Query millions of logs in milliseconds. Built on a modern stack.",
                gradient: "from-yellow-500/20 to-orange-500/20",
              },
              {
                icon: Shield,
                title: "Enterprise secure",
                desc: "SOC 2 compliant with end-to-end encryption and role-based access.",
                gradient: "from-blue-500/20 to-cyan-500/20",
              },
              {
                icon: Code,
                title: "Developer first",
                desc: "REST APIs, SDKs, and webhooks. Integrate with anything.",
                gradient: "from-purple-500/20 to-pink-500/20",
              },
              {
                icon: Layers,
                title: "Smart templates",
                desc: "Pre-built dashboards and queries for common use cases.",
                gradient: "from-emerald-500/20 to-teal-500/20",
              },
              {
                icon: TrendingUp,
                title: "Real-time alerts",
                desc: "Get notified instantly when things go wrong. Multiple channels.",
                gradient: "from-red-500/20 to-rose-500/20",
              },
              {
                icon: Terminal,
                title: "CLI & automation",
                desc: "Scriptable workflows and infrastructure as code support.",
                gradient: "from-violet-500/20 to-purple-500/20",
              },
            ].map((feature, i) => (
              <SpotlightCard
                key={i}
                className={`feature-card p-8 bg-zinc-950/40 border border-white/[0.06] transition-all duration-500 hover:bg-zinc-900/40 hover:border-white/[0.12] group`}
              >
                <div className={`mb-6 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center border border-white/[0.06] group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-light">{feature.desc}</p>
              </SpotlightCard>
            ))}
          </div>

          {/* Large Feature Showcase */}
          <div className="mt-12 reveal-item">
            <SpotlightCard className="relative overflow-hidden bg-zinc-950/40 border border-white/[0.06] rounded-2xl">
              <div className="grid lg:grid-cols-5 gap-0">
                <div className="lg:col-span-2 p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/[0.06] flex flex-col justify-center">
                  <div className="inline-block mb-4 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold w-fit">
                    Powered by AI
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
                    Automatic root cause analysis
                  </h3>
                  <p className="text-base text-zinc-500 leading-relaxed font-light mb-8">
                    Our AI models analyze patterns across your infrastructure to pinpoint issues before they impact users.
                  </p>
                  <Link href="/features">
                    <Button variant="outline" className="w-fit h-10 border-white/10 px-6 rounded-lg text-sm font-medium hover:bg-white/5">
                      Learn more
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="lg:col-span-3 p-12 lg:p-16 bg-gradient-to-br from-violet-500/[0.03] to-transparent relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.1),transparent_50%)]" />
                  <div className="relative h-64 lg:h-80 border border-white/[0.06] rounded-xl bg-zinc-900/50 backdrop-blur-xl p-6 flex items-center justify-center">
                    <Terminal className="w-16 h-16 text-zinc-700" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* AI Section - Enhanced */}
      <section ref={aiSectionRef} className="reveal-section relative py-20 lg:py-28 px-6 lg:px-8 border-t border-white/[0.04]">
        <div className="mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-item space-y-8">
              <div className="inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
                Intelligence
              </div>
              <h2 className="text-4xl lg:text-5xl font-semibold tracking-tight leading-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Stop searching.
                <br />
                Start understanding.
              </h2>
              <p className="text-lg text-zinc-500 leading-relaxed font-light">
                LogLens uses advanced machine learning to surface insights that matter. Spend less time debugging, more time building.
              </p>
              <div className="flex flex-wrap gap-6">
                {[
                  { label: "Faster diagnosis", value: "10x" },
                  { label: "False positives", value: "<1%" },
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="text-3xl font-semibold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-zinc-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal-item space-y-4">
              {[
                {
                  name: "Anomaly Detection",
                  desc: "Real-time pattern recognition",
                  active: true,
                  icon: TrendingUp,
                  color: "emerald"
                },
                {
                  name: "Threat Monitor",
                  desc: "Security event correlation",
                  active: true,
                  icon: Shield,
                  color: "blue"
                },
                {
                  name: "Smart Clustering",
                  desc: "Automatic log grouping",
                  active: false,
                  icon: Layers,
                  color: "violet"
                },
              ].map((agent, i) => (
                <SpotlightCard
                  key={i}
                  className={`p-6 rounded-xl border transition-all duration-500 ${agent.active
                    ? 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04]'
                    : 'bg-zinc-950/40 border-white/[0.04] opacity-50'
                    }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-500 ${agent.active
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-white/[0.04] text-zinc-700 border border-white/[0.06]'
                        }`}>
                        <agent.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="text-base font-semibold mb-1 text-white">{agent.name}</div>
                        <div className="text-sm text-zinc-500">{agent.desc}</div>
                      </div>
                    </div>
                    {agent.active && (
                      <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400">Active</span>
                      </div>
                    )}
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Enhanced */}
      <section id="pricing" className="reveal-section relative py-20 lg:py-28 px-6 lg:px-8 border-t border-white/[0.04]">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 reveal-item text-center">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
              Pricing
            </div>
            <h2 className="text-4xl lg:text-6xl font-semibold tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-zinc-500 max-w-2xl mx-auto font-light">
              Start free, scale as you grow. No hidden fees.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="pricing-grid grid lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$0",
                period: "forever",
                desc: "Perfect for side projects and small teams",
                features: [
                  "Up to 500 events/month",
                  "7-day retention",
                  "Basic dashboards",
                  "Email support",
                  "Public sharing"
                ],
                cta: "Start for free",
                highlight: false,
              },
              {
                name: "Pro",
                price: "$29",
                period: "per user/month",
                desc: "For growing teams with serious needs",
                features: [
                  "Unlimited events",
                  "90-day retention",
                  "Advanced AI analysis",
                  "Priority support",
                  "Custom integrations",
                  "Team collaboration"
                ],
                cta: "Start free trial",
                highlight: true,
              },
            ].map((plan, i) => (
              <SpotlightCard
                key={i}
                className={`pricing-card p-8 lg:p-10 rounded-2xl transition-all duration-500 ${plan.highlight
                  ? 'bg-white/[0.03] border-2 border-violet-500/20 shadow-[0_20px_80px_rgba(139,92,246,0.15)] hover:border-violet-500/30'
                  : 'bg-zinc-950/40 border border-white/[0.06] hover:bg-zinc-900/40'
                  }`}
              >
                {plan.highlight && (
                  <div className="mb-6 inline-block px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
                    Most popular
                  </div>
                )}

                <h3 className="text-2xl font-semibold mb-2 text-white">{plan.name}</h3>
                <p className="text-sm text-zinc-500 mb-6">{plan.desc}</p>

                <div className="mb-8">
                  <span className="text-5xl font-semibold text-white">{plan.price}</span>
                  <span className="text-sm text-zinc-500 ml-2">/ {plan.period}</span>
                </div>

                <Button
                  className={`w-full h-12 rounded-xl text-[15px] font-semibold transition-all duration-300 mb-8 ${plan.highlight
                    ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-black/20 hover:shadow-violet-500/20 hover:scale-[1.02]'
                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                    }`}
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-4">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                      <span className="text-zinc-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="mt-12 reveal-item text-center">
            <p className="text-sm text-zinc-500 mb-4">
              Need custom volumes or dedicated support?
            </p>
            <Link href="/enterprise">
              <Button variant="outline" className="h-10 border-white/10 px-6 rounded-lg text-sm font-medium hover:bg-white/5">
                Talk to sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="reveal-section relative py-20 lg:py-28 px-6 lg:px-8 border-t border-white/[0.04]">
        <div className="mx-auto max-w-4xl text-center reveal-item">
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold">
            Get started today
          </div>
          <h2 className="text-4xl lg:text-6xl font-semibold mb-8 tracking-tight leading-tight bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
            Join thousands of teams building better products
          </h2>
          <p className="text-lg text-zinc-500 mb-12 font-light max-w-2xl mx-auto">
            Start your free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button className="group h-14 px-10 bg-white text-black hover:bg-white/90 rounded-xl text-base font-semibold shadow-2xl shadow-black/30 hover:shadow-violet-500/30 transition-all duration-500 hover:scale-[1.02]">
                Start for free
                <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="https://github.com/loglens">
              <Button variant="outline" className="h-14 px-10 border-white/[0.08] bg-white/[0.02] text-white hover:bg-white/[0.05] hover:border-white/[0.15] rounded-xl text-base font-medium backdrop-blur-xl transition-all duration-300">
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="relative py-16 px-6 lg:px-8 border-t border-white/[0.04]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-violet-400" />
                <span className="text-lg font-semibold">LogLens</span>
              </Link>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Production-ready observability for modern teams.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Changelog", "Docs"]
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"]
              },
              {
                title: "Legal",
                links: [
                  { name: "Privacy", href: "/privacy" },
                  { name: "Terms", href: "/terms" },
                  { name: "Security", href: "/security" },
                  { name: "Status", href: "/status" }
                ]
              }
            ].map((section, i) => (
              <div key={i}>
                <h4 className="text-sm font-semibold mb-4 text-white">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <Link
                        href={typeof link === 'string' ? '#' : link.href}
                        className="text-sm text-zinc-600 hover:text-white transition-colors"
                      >
                        {typeof link === 'string' ? link : link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-zinc-600">
              © 2024 LogLens Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {["Twitter", "GitHub", "Discord"].map((social, i) => (
                <Link key={i} href="#" className="text-sm text-zinc-600 hover:text-white transition-colors">
                  {social}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import React from "react"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, Zap, BarChart3, ArrowRight, Github } from "lucide-react";

function MockLogPanel() {
  const logs = [
    { level: "INFO", service: "api", message: "Server started on port 3000" },
    {
      level: "DEBUG",
      service: "db",
      message: "Connection pool initialized",
    },
    { level: "WARN", service: "cache", message: "Memory usage at 85%" },
    {
      level: "ERROR",
      service: "auth",
      message: "Connection timeout to Redis",
    },
    { level: "INFO", service: "api", message: "Request processed: 145ms" },
  ];

  return (
    <div className="rounded-lg border border-border bg-card/50 p-3 backdrop-blur">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-muted-foreground">Recent Logs</span>
      </div>
      <div className="space-y-1.5">
        {logs.map((log, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs font-mono"
          >
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                log.level === "ERROR"
                  ? "bg-red-500/20 text-red-400"
                  : log.level === "WARN"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : log.level === "DEBUG"
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {log.level}
            </span>
            <span className="text-primary">[{log.service}]</span>
            <span className="text-muted-foreground truncate">{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockTerminal() {
  const lines = [
    { type: "prompt", text: "$ tail -f /var/log/app.log" },
    {
      type: "output",
      text: '2024-02-01T10:15:23.456Z INFO [server] Application started',
    },
    {
      type: "output",
      text: "2024-02-01T10:15:24.123Z DEBUG [database] Pool initialized",
    },
    {
      type: "error",
      text: "2024-02-01T10:17:12.567Z ERROR [api] ETIMEDOUT req_abc123",
    },
    {
      type: "output",
      text: "2024-02-01T10:18:01.123Z INFO [api] POST /api/users 201 145ms",
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-black/80 p-3 backdrop-blur font-mono text-xs">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        <span className="ml-2 text-muted-foreground">Terminal</span>
      </div>
      <div className="space-y-1">
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === "prompt"
                ? "text-green-400"
                : line.type === "error"
                  ? "text-red-400"
                  : "text-gray-300"
            }
          >
            {line.text}
          </div>
        ))}
        <div className="text-green-400 animate-pulse">{"$ _"}</div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-border bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/50 hover:bg-card/80">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BarChart3 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">LogLens</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link href="/dashboard">
              <Button size="sm">Open App</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Intelligent log analysis
              </span>
            </h1>
            <p className="mb-2 text-3xl font-semibold text-primary md:text-4xl">
              powered by AI
            </p>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Analyze production logs instantly. Detect patterns automatically.
              Zero infrastructure required.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Start Analyzing
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => {
                  document
                    .getElementById("demo")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                View Demo
              </Button>
            </div>
          </div>

          {/* 3D Mockup */}
          <div
            id="demo"
            className="mt-20 perspective-1000"
          >
            <div
              className="mx-auto max-w-4xl animate-float"
              style={{
                transform: "rotateX(10deg) rotateY(-5deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-xl" />

                {/* Panels */}
                <div className="relative grid gap-4 md:grid-cols-2">
                  <div
                    className="transform transition-transform hover:translate-z-4"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    <MockLogPanel />
                  </div>
                  <div
                    className="transform transition-transform hover:translate-z-4"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <MockTerminal />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={Bot}
              title="AI Pattern Detection"
              description="Automatically group similar errors and identify anomalies in your logs using advanced pattern recognition."
            />
            <FeatureCard
              icon={Zap}
              title="Zero Infrastructure"
              description="Runs entirely in your browser. No servers, no databases, no setup. Just paste your logs and go."
            />
            <FeatureCard
              icon={BarChart3}
              title="Real-time Insights"
              description="Get instant analysis as you type. See trends, spikes, and patterns the moment your logs are loaded."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
                <BarChart3 className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                LogLens - Built with v0
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="https://github.com"
                target="_blank"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: rotateX(10deg) rotateY(-5deg) translateY(0px);
          }
          50% {
            transform: rotateX(10deg) rotateY(-5deg) translateY(-10px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'System Status - LogLens',
    description: 'LogLens System Status - Real-time platform health and uptime information',
};

export default function StatusPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40 pointer-events-none" />

            <article className="relative max-w-[900px] mx-auto px-6 py-24">
                {/* Header */}
                <header className="mb-16 border-b border-white/5 pb-12">
                    <h1 className="text-4xl font-semibold text-white mb-4 tracking-tight">
                        System Status
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Real-time platform health and performance
                    </p>
                </header>

                {/* Current Status */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <h2 className="text-2xl font-medium text-zinc-300">All Systems Operational</h2>
                    </div>
                    <p className="text-zinc-400 leading-relaxed">
                        All systems are currently operating normally. Last updated: February 3, 2024 at 6:42 PM IST
                    </p>
                </section>

                {/* System Components */}
                <section className="mb-16 border-t border-white/5 pt-16">
                    <h2 className="text-2xl font-medium text-zinc-300 mb-8">System Components</h2>

                    <div className="space-y-4">
                        {[
                            { name: 'API', status: 'operational', uptime: '99.99%' },
                            { name: 'Dashboard', status: 'operational', uptime: '99.98%' },
                            { name: 'Log Ingestion', status: 'operational', uptime: '99.99%' },
                            { name: 'Search & Query', status: 'operational', uptime: '99.97%' },
                            { name: 'AI Analysis', status: 'operational', uptime: '99.96%' },
                            { name: 'Webhooks', status: 'operational', uptime: '99.95%' },
                            { name: 'Authentication', status: 'operational', uptime: '100%' },
                        ].map((component) => (
                            <div
                                key={component.name}
                                className="flex items-center justify-between py-4 px-6 border border-white/5 rounded-lg bg-white/[0.01]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-zinc-300 font-medium">{component.name}</span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm text-zinc-500">
                                        {component.uptime} uptime
                                    </span>
                                    <span className="text-sm text-emerald-500 font-medium">
                                        Operational
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Uptime History */}
                <section className="mb-16 border-t border-white/5 pt-16">
                    <h2 className="text-2xl font-medium text-zinc-300 mb-8">Uptime History</h2>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-zinc-400">Last 30 days</span>
                                <span className="text-zinc-300 font-medium">99.98% uptime</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '99.98%' }} />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-zinc-400">Last 90 days</span>
                                <span className="text-zinc-300 font-medium">99.97% uptime</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '99.97%' }} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Incident History */}
                <section className="mb-16 border-t border-white/5 pt-16">
                    <h2 className="text-2xl font-medium text-zinc-300 mb-8">Recent Incidents</h2>

                    <div className="space-y-8">
                        <div className="border-l-2 border-white/10 pl-6">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-medium text-zinc-300">
                                    Scheduled Maintenance
                                </h3>
                                <span className="text-sm text-zinc-500">Jan 28, 2024</span>
                            </div>
                            <p className="text-zinc-400 leading-relaxed mb-3">
                                Routine database maintenance performed. All services remained available with no customer impact.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-sm text-blue-400">Maintenance</span>
                            </div>
                        </div>

                        <div className="border-l-2 border-white/10 pl-6">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-medium text-zinc-300">
                                    API Latency Increase
                                </h3>
                                <span className="text-sm text-zinc-500">Jan 15, 2024</span>
                            </div>
                            <p className="text-zinc-400 leading-relaxed mb-3">
                                Brief increase in API response times due to traffic spike. Resolved by auto-scaling within 8 minutes.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm text-emerald-400">Resolved</span>
                            </div>
                        </div>

                        <div className="border-l-2 border-white/10 pl-6">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-medium text-zinc-300">
                                    Dashboard Performance Optimization
                                </h3>
                                <span className="text-sm text-zinc-500">Jan 3, 2024</span>
                            </div>
                            <p className="text-zinc-400 leading-relaxed mb-3">
                                Deployed performance improvements to the dashboard. Load times reduced by 40%.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-violet-500" />
                                <span className="text-sm text-violet-400">Update</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SLA Information */}
                <section className="mb-16 border-t border-white/5 pt-16">
                    <h2 className="text-2xl font-medium text-zinc-300 mb-6">Service Level Agreement</h2>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                        LogLens is committed to providing a reliable and highly available service. Our SLA guarantees:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                        <li>99.9% uptime for all paid plans</li>
                        <li>99.95% uptime for Enterprise plans</li>
                        <li>Service credits for downtime exceeding SLA thresholds</li>
                        <li>24/7 support for critical incidents</li>
                    </ul>
                </section>

                {/* Status Updates */}
                <section className="mb-16 border-t border-white/5 pt-16">
                    <h2 className="text-2xl font-medium text-zinc-300 mb-6">Subscribe to Updates</h2>
                    <p className="text-zinc-400 leading-relaxed mb-6">
                        Stay informed about system status, scheduled maintenance, and incidents:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-zinc-400">
                        <li>Email notifications for incidents and maintenance</li>
                        <li>RSS feed for status updates</li>
                        <li>Webhook notifications for automated monitoring</li>
                        <li>Status page API for integration</li>
                    </ul>
                </section>

                {/* Contact */}
                <section className="border-t border-white/5 pt-16">
                    <h2 className="text-2xl font-medium text-zinc-300 mb-6">Report an Issue</h2>
                    <p className="text-zinc-400 leading-relaxed mb-4">
                        If you're experiencing issues not reflected on this page, please contact our support team:
                    </p>
                    <p className="text-zinc-300">
                        Email: support@loglens.io<br />
                        Emergency hotline: +1 (555) 123-4567
                    </p>
                </section>

                {/* Back to home */}
                <div className="mt-24 pt-12 border-t border-white/5">
                    <Link
                        href="/"
                        className="text-sm text-zinc-500 hover:text-white transition-colors duration-200"
                    >
                        ← Back to home
                    </Link>
                </div>
            </article>
        </div>
    );
}

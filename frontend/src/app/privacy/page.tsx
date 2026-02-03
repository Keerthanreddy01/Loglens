import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy - LogLens',
    description: 'LogLens Privacy Policy - How we collect, use, and protect your data',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40 pointer-events-none" />

            <article className="relative max-w-[900px] mx-auto px-6 py-24">
                {/* Header */}
                <header className="mb-16 border-b border-white/5 pb-12">
                    <h1 className="text-4xl font-semibold text-white mb-4 tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Last updated: February 3, 2024
                    </p>
                </header>

                {/* Content */}
                <div className="space-y-16 text-zinc-400 leading-relaxed">
                    <section id="introduction">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Introduction</h2>
                        <p className="mb-4">
                            LogLens Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our log intelligence platform and related services.
                        </p>
                        <p>
                            By accessing or using LogLens, you agree to this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access the platform.
                        </p>
                    </section>

                    <section id="information-collection" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Information We Collect</h2>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Account Information</h3>
                        <p className="mb-4">
                            When you create an account, we collect your name, email address, company name, and password. This information is necessary to provide you with access to our services.
                        </p>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Log Data</h3>
                        <p className="mb-4">
                            We process and store log data that you send to our platform. This may include application logs, system logs, error messages, and related metadata. We treat this data as confidential and implement appropriate security measures.
                        </p>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Usage Information</h3>
                        <p>
                            We automatically collect information about how you interact with our platform, including features used, queries executed, and performance metrics. This helps us improve our services.
                        </p>
                    </section>

                    <section id="data-usage" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Process and analyze your log data as requested</li>
                            <li>Send you technical notices and support messages</li>
                            <li>Respond to your comments and questions</li>
                            <li>Detect and prevent fraud and abuse</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section id="data-sharing" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Data Sharing and Disclosure</h2>
                        <p className="mb-4">
                            We do not sell your personal information. We may share your information only in the following circumstances:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>With your consent or at your direction</li>
                            <li>With service providers who assist in our operations</li>
                            <li>To comply with legal obligations</li>
                            <li>To protect our rights and prevent fraud</li>
                            <li>In connection with a merger or acquisition</li>
                        </ul>
                    </section>

                    <section id="data-security" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Data Security</h2>
                        <p className="mb-4">
                            We implement industry-standard security measures to protect your information, including:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Encryption in transit and at rest</li>
                            <li>Regular security audits and penetration testing</li>
                            <li>Access controls and authentication</li>
                            <li>SOC 2 Type II compliance</li>
                        </ul>
                    </section>

                    <section id="data-retention" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Data Retention</h2>
                        <p>
                            We retain your information for as long as your account is active or as needed to provide you services. Log data is retained according to your plan's retention period. You may request deletion of your data at any time.
                        </p>
                    </section>

                    <section id="your-rights" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Your Rights</h2>
                        <p className="mb-4">
                            Depending on your location, you may have the following rights:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Object to processing</li>
                            <li>Data portability</li>
                        </ul>
                    </section>

                    <section id="contact" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Contact Us</h2>
                        <p className="mb-4">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-zinc-300">
                            Email: privacy@loglens.io<br />
                            Address: LogLens Inc., 123 Tech Street, San Francisco, CA 94105
                        </p>
                    </section>
                </div>

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


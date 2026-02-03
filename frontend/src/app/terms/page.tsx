import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service - LogLens',
    description: 'LogLens Terms of Service - Legal terms and conditions for using our platform',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40 pointer-events-none" />

            <article className="relative max-w-[900px] mx-auto px-6 py-24">
                {/* Header */}
                <header className="mb-16 border-b border-white/5 pb-12">
                    <h1 className="text-4xl font-semibold text-white mb-4 tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Last updated: February 3, 2024
                    </p>
                </header>

                {/* Content */}
                <div className="space-y-16 text-zinc-400 leading-relaxed">
                    <section id="acceptance">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing and using LogLens ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this Service.
                        </p>
                        <p>
                            These Terms of Service ("Terms") govern your use of our log intelligence platform and related services provided by LogLens Inc. ("LogLens," "we," "us," or "our").
                        </p>
                    </section>

                    <section id="service-description" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Service Description</h2>
                        <p className="mb-4">
                            LogLens provides a cloud-based log intelligence platform that enables you to collect, analyze, and visualize log data from your applications and infrastructure.
                        </p>
                        <p>
                            We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.
                        </p>
                    </section>

                    <section id="account-responsibilities" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Account Responsibilities</h2>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Account Security</h3>
                        <p className="mb-4">
                            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
                        </p>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Accurate Information</h3>
                        <p>
                            You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                        </p>
                    </section>

                    <section id="acceptable-use" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Acceptable Use Policy</h2>
                        <p className="mb-4">You agree not to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Violate any applicable laws or regulations</li>
                            <li>Infringe on intellectual property rights</li>
                            <li>Transmit malicious code or viruses</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                            <li>Interfere with or disrupt the Service</li>
                            <li>Use the Service for any illegal or unauthorized purpose</li>
                        </ul>
                    </section>

                    <section id="data-ownership" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Data Ownership and Rights</h2>
                        <p className="mb-4">
                            You retain all rights to your log data. By using our Service, you grant us a limited license to process, store, and analyze your data solely for the purpose of providing the Service.
                        </p>
                        <p>
                            We do not claim ownership of your data and will not use it for any purpose other than providing and improving our services.
                        </p>
                    </section>

                    <section id="payment-terms" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Payment Terms</h2>
                        <p className="mb-4">
                            Paid plans are billed in advance on a monthly or annual basis. Fees are non-refundable except as required by law or as explicitly stated in your agreement.
                        </p>
                        <p>
                            We reserve the right to change our pricing with 30 days' notice. Continued use of the Service after a price change constitutes acceptance of the new pricing.
                        </p>
                    </section>

                    <section id="service-level" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Service Level Agreement</h2>
                        <p className="mb-4">
                            We strive to maintain 99.9% uptime for our Service. Specific SLA terms are outlined in your service agreement for enterprise customers.
                        </p>
                        <p>
                            Scheduled maintenance will be announced in advance when possible.
                        </p>
                    </section>

                    <section id="termination" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Termination</h2>
                        <p className="mb-4">
                            You may terminate your account at any time through your account settings. We may terminate or suspend your access immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                        </p>
                        <p>
                            Upon termination, your right to use the Service will immediately cease. We will retain your data for 30 days after termination, after which it will be permanently deleted.
                        </p>
                    </section>

                    <section id="warranties" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Warranties and Disclaimers</h2>
                        <p className="mb-4">
                            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE.
                        </p>
                        <p>
                            We make no warranty regarding the quality, accuracy, or reliability of any information obtained through the Service.
                        </p>
                    </section>

                    <section id="limitation-liability" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, LOGLENS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
                        </p>
                    </section>

                    <section id="changes" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Changes to Terms</h2>
                        <p>
                            We reserve the right to modify these Terms at any time. We will notify you of material changes via email or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    <section id="contact" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Contact Information</h2>
                        <p className="mb-4">
                            For questions about these Terms, please contact us at:
                        </p>
                        <p className="text-zinc-300">
                            Email: legal@loglens.io<br />
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


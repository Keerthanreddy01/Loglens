import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Security - LogLens',
    description: 'LogLens Security - Our commitment to protecting your data and infrastructure',
};

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40 pointer-events-none" />

            <article className="relative max-w-[900px] mx-auto px-6 py-24">
                {/* Header */}
                <header className="mb-16 border-b border-white/5 pb-12">
                    <h1 className="text-4xl font-semibold text-white mb-4 tracking-tight">
                        Security
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Our commitment to protecting your data
                    </p>
                </header>

                {/* Content */}
                <div className="space-y-16 text-zinc-400 leading-relaxed">
                    <section id="overview">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Security Overview</h2>
                        <p className="mb-4">
                            Security is fundamental to everything we do at LogLens. We understand that you're trusting us with your most sensitive operational data, and we take that responsibility seriously.
                        </p>
                        <p>
                            Our security program is designed to protect your data through multiple layers of defense, continuous monitoring, and regular third-party audits.
                        </p>
                    </section>

                    <section id="compliance" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Compliance & Certifications</h2>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">SOC 2 Type II</h3>
                        <p className="mb-4">
                            LogLens is SOC 2 Type II certified. We undergo annual audits by independent third-party auditors to verify our security controls and processes.
                        </p>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">GDPR Compliance</h3>
                        <p className="mb-4">
                            We are fully compliant with the General Data Protection Regulation (GDPR) and provide tools for data subject access requests, data portability, and deletion.
                        </p>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">HIPAA Compliance</h3>
                        <p>
                            For healthcare customers, we offer HIPAA-compliant configurations and will sign Business Associate Agreements (BAAs).
                        </p>
                    </section>

                    <section id="infrastructure" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Infrastructure Security</h2>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Cloud Infrastructure</h3>
                        <p className="mb-4">
                            LogLens runs on enterprise-grade cloud infrastructure with:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                            <li>Multi-region redundancy for high availability</li>
                            <li>Automated backups with point-in-time recovery</li>
                            <li>DDoS protection and traffic filtering</li>
                            <li>Network isolation and segmentation</li>
                        </ul>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Physical Security</h3>
                        <p>
                            Our infrastructure providers maintain SOC 2 certified data centers with 24/7 security monitoring, biometric access controls, and environmental controls.
                        </p>
                    </section>

                    <section id="data-protection" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Data Protection</h2>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Encryption</h3>
                        <p className="mb-4">
                            All data is encrypted both in transit and at rest:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                            <li>TLS 1.3 for data in transit</li>
                            <li>AES-256 encryption for data at rest</li>
                            <li>Encrypted backups with separate key management</li>
                        </ul>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Data Isolation</h3>
                        <p className="mb-4">
                            Customer data is logically isolated using:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Tenant-specific encryption keys</li>
                            <li>Database-level isolation</li>
                            <li>Access control policies</li>
                        </ul>
                    </section>

                    <section id="access-control" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Access Control</h2>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Authentication</h3>
                        <p className="mb-4">
                            We support multiple authentication methods:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                            <li>Single Sign-On (SSO) via SAML 2.0</li>
                            <li>Multi-factor authentication (MFA)</li>
                            <li>API key management with rotation</li>
                        </ul>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Authorization</h3>
                        <p className="mb-4">
                            Fine-grained access controls include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Role-based access control (RBAC)</li>
                            <li>Team and project-level permissions</li>
                            <li>Audit logs for all access events</li>
                        </ul>
                    </section>

                    <section id="application-security" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Application Security</h2>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Secure Development</h3>
                        <p className="mb-4">
                            Our development process includes:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                            <li>Security training for all engineers</li>
                            <li>Code review requirements</li>
                            <li>Automated security scanning in CI/CD</li>
                            <li>Dependency vulnerability monitoring</li>
                        </ul>

                        <h3 className="text-lg font-medium text-zinc-400 mb-4 mt-8">Penetration Testing</h3>
                        <p>
                            We conduct annual penetration tests by independent security firms and maintain a bug bounty program for responsible disclosure.
                        </p>
                    </section>

                    <section id="monitoring" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Security Monitoring</h2>
                        <p className="mb-4">
                            Our security operations include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>24/7 security monitoring and alerting</li>
                            <li>Intrusion detection and prevention systems</li>
                            <li>Automated threat detection</li>
                            <li>Incident response procedures</li>
                            <li>Regular security assessments</li>
                        </ul>
                    </section>

                    <section id="incident-response" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Incident Response</h2>
                        <p className="mb-4">
                            In the event of a security incident:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                            <li>We will notify affected customers within 72 hours</li>
                            <li>Our incident response team will investigate and contain the issue</li>
                            <li>We will provide regular updates throughout the resolution process</li>
                            <li>Post-incident reports will be shared with affected customers</li>
                        </ul>
                    </section>

                    <section id="employee-security" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Employee Security</h2>
                        <p className="mb-4">
                            All LogLens employees undergo:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Background checks before employment</li>
                            <li>Security awareness training</li>
                            <li>Confidentiality agreements</li>
                            <li>Principle of least privilege access</li>
                        </ul>
                    </section>

                    <section id="responsible-disclosure" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Responsible Disclosure</h2>
                        <p className="mb-4">
                            If you discover a security vulnerability, please report it to us at:
                        </p>
                        <p className="text-zinc-300 mb-4">
                            Email: security@loglens.io
                        </p>
                        <p>
                            We appreciate responsible disclosure and will work with you to understand and resolve the issue promptly.
                        </p>
                    </section>

                    <section id="questions" className="border-t border-white/5 pt-16">
                        <h2 className="text-2xl font-medium text-zinc-300 mb-6">Security Questions</h2>
                        <p className="mb-4">
                            For security-related inquiries or to request our security documentation, please contact:
                        </p>
                        <p className="text-zinc-300">
                            Email: security@loglens.io<br />
                            We typically respond within 24 hours.
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

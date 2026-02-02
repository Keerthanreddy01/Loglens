export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center relative selection:bg-blue-500/30 font-sans">
            {children}
        </div>
    )
}

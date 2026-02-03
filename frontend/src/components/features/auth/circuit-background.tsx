'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CircuitBackgroundProps {
    isError: boolean
}

export function CircuitBackground({ isError }: CircuitBackgroundProps) {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none bg-[#020202] z-0">
            {/* Background depth gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,20,40,0.5),rgba(0,0,0,1))]" />

            {/* Subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}
            />

            {/* Corner Chips */}
            <div className="absolute top-12 left-12"><Chip position="tl" /></div>
            <div className="absolute top-12 right-12"><Chip position="tr" /></div>
            <div className="absolute bottom-12 left-12"><Chip position="bl" /></div>
            <div className="absolute bottom-12 right-12"><Chip position="br" /></div>

            {/* Main Wires SVG */}
            <svg
                className="absolute inset-0 w-full h-full opacity-60"
                viewBox="0 0 1000 1000"
                preserveAspectRatio="xMidYMid slice"
            >
                <ConnectionLines isError={isError} />
            </svg>

            {/* Global Error Overlays */}
            <AnimatePresence>
                {isError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-red-600/10 mix-blend-overlay"
                        transition={{ duration: 0.4, repeat: 5 }}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function Chip({ position }: { position: string }) {
    const isLeft = position.includes('l')
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-14 bg-[#0d0d0d] border border-white/[0.08] rounded-2xl relative overflow-hidden backdrop-blur-xl shadow-2xl"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
            <div className="p-3 h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-center">
                    <motion.div
                        animate={{
                            boxShadow: ["0 0 5px #3b82f6", "0 0 15px #3b82f6", "0 0 5px #3b82f6"],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-500"
                    />
                    <div className="w-8 h-1 bg-white/10 rounded-full" />
                </div>
                <div className="space-y-1 mt-auto">
                    <div className="w-full h-[2px] bg-white/5 rounded-full" />
                    <div className="w-1/2 h-[2px] bg-white/5 rounded-full opacity-50" />
                </div>
            </div>

            {/* Pins */}
            <div className={cn(
                "absolute top-1/2 -translate-y-1/2 flex flex-col gap-2",
                isLeft ? "-right-[2px] items-end" : "-left-[2px] items-start"
            )}>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-2 h-[1px] bg-white/20" />
                ))}
            </div>
        </motion.div>
    )
}

function ConnectionLines({ isError }: { isError: boolean }) {
    // Converging paths focused towards center
    const paths = [
        "M 100 100 L 300 100 L 350 200 L 350 400 L 450 400", // TL
        "M 900 100 L 700 100 L 650 200 L 650 400 L 550 400", // TR
        "M 100 900 L 300 900 L 350 800 L 350 600 L 450 600", // BL
        "M 900 900 L 700 900 L 650 800 L 650 600 L 550 600", // BR
    ]

    return (
        <g fill="none" strokeWidth="1">
            {paths.map((d, i) => (
                <React.Fragment key={i}>
                    {/* Static tracer line */}
                    <path d={d} stroke="white" strokeOpacity="0.03" />

                    {/* Active pulse */}
                    <motion.path
                        d={d}
                        stroke={isError ? "#ef4444" : "#3b82f6"}
                        strokeOpacity="0.8"
                        strokeDasharray="15 300"
                        initial={{ strokeDashoffset: 315 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                            delay: i * 0.7
                        }}
                        style={{ filter: isError ? 'drop-shadow(0 0 5px #ef4444)' : 'drop-shadow(0 0 3px #3b82f6)' }}
                    />

                    {/* Shock effect on error */}
                    <AnimatePresence>
                        {isError && (
                            <motion.path
                                d={d}
                                stroke="#ef4444"
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{
                                    opacity: [0, 1, 0, 1, 0, 1, 0],
                                    strokeWidth: [2, 6, 1, 8, 2],
                                    filter: ['blur(1px)', 'blur(3px)', 'blur(1px)']
                                }}
                                transition={{ duration: 0.4, repeat: 4 }}
                            />
                        )}
                    </AnimatePresence>
                </React.Fragment>
            ))}
        </g>
    )
}


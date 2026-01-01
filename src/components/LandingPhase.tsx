import React from 'react';
import { motion } from 'framer-motion';
import { Scan, Zap, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../store';
import { FinalLogo } from './FinalLogo';

export const LandingPhase: React.FC = () => {
    const { signIn } = useAppStore();

    const features = [
        {
            icon: <Scan className="w-5 h-5" />,
            title: 'Precision Scanning',
            description: 'Advanced vision models extract every item and price with high accuracy.'
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: 'Instant Assignment',
            description: 'Assign items to people in real-time. Bills are updated as you tap.'
        },
        {
            icon: <ShieldCheck className="w-5 h-5" />,
            title: 'Secure History',
            description: 'Your receipts are synced to your account, accessible across any device.'
        },
    ];


    return (
        <div className="flex flex-col h-[100dvh] bg-white font-sans selection:bg-blue-100 overflow-hidden relative">
            {/* Native-feel Top Navbar */}
            <div className="fixed top-0 left-0 right-0 h-16 glass-navbar flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-3">
                    <FinalLogo size={32} />
                    <div className="flex items-baseline tracking-tight leading-none text-xl font-bold text-slate-900">
                        BillBeam
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col pt-16">
                {/* Hero Section */}
                <div className="pt-8 pb-4 px-6 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-8 short-mb-4"
                    >
                        <FinalLogo size={90} className="short-size-64" />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-center"
                    >
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12] short-text-h1">
                            Bill splitting,<br />
                            <span className="text-slate-400 font-medium">reimagined.</span>
                        </h1>
                    </motion.div>
                </div>

                {/* Subtle Feature List */}
                <div className="px-8 sm:px-12 py-4 sm:py-8 space-y-10 sm:space-y-10 flex-1 flex flex-col justify-center w-full max-w-md mx-auto short-py short-space">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                            className="flex gap-5 sm:gap-5"
                        >
                            <div className="flex-shrink-0 mt-1 text-slate-400">
                                {React.cloneElement(feature.icon as React.ReactElement<any>, { className: "w-6 h-6" })}
                            </div>
                            <div className="space-y-1.5">
                                <h3 className="text-base sm:text-[15px] font-semibold text-slate-800 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-sm sm:text-sm text-slate-500 leading-normal font-normal">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Professional CTA footer */}
                <div className="p-8 pb-12 short-py mt-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-xs mx-auto"
                    >
                        <button
                            onClick={signIn}
                            className="w-full h-14 bg-slate-900 text-white rounded-xl text-base font-semibold flex items-center justify-center gap-3 transition-all hover:bg-slate-800 active:scale-[0.98] shadow-sm short-h"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <p className="mt-6 text-center text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                            Enterprise Grade Expense Management
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

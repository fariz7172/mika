'use client';

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-slate-50 min-h-[90vh] flex items-center">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-rose-100/50 rounded-l-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-100 rounded-tr-[100px] -z-10" />

            <div className="container px-4 md:px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col gap-6"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-rose-200 text-rose-800 text-sm font-bold w-fit">
                        New Collection 2024
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 leading-tight">
                        Gaya <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-500">Impian</span> <br />
                        Dalam Genggaman
                    </h1>
                    <p className="text-lg text-slate-600 max-w-lg">
                        Temukan fashion terbaik dengan palet warna yang menenangkan dan desain modern. Tampil percaya diri setiap hari.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Link href="/products" className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-all hover:scale-105">
                            Belanja Sekarang <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/about" className="flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-100 rounded-full font-bold hover:bg-indigo-50 transition-all">
                            Pelajari Lebih Lanjut
                        </Link>
                    </div>
                </motion.div>

                {/* Graphic / Image Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="relative w-full aspect-square max-w-lg mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-indigo-200 rounded-full animate-blob blur-3xl opacity-70" />
                        <div className="relative bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                                    <div className="w-3 h-3 rounded-full bg-indigo-400" />
                                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                                </div>
                                <ShoppingBag className="text-slate-400" />
                            </div>

                            {/* Abstract Product Illustration */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-8">
                                    <div className="h-32 bg-rose-100 rounded-2xl w-full" />
                                    <div className="h-16 bg-slate-100 rounded-2xl w-full" />
                                </div>
                                <div className="space-y-4">
                                    <div className="h-16 bg-indigo-100 rounded-2xl w-full" />
                                    <div className="h-40 bg-slate-200 rounded-2xl w-full" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                                <div>
                                    <p className="text-xs text-slate-400">Total Belanja</p>
                                    <p className="font-bold text-slate-800">Rp 1.250.000</p>
                                </div>
                                <div className="px-4 py-2 bg-slate-900 text-white text-xs rounded-lg">Checkout</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

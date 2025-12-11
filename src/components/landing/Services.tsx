'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Clock, CreditCard, Star } from "lucide-react";
import { useEffect } from 'react';

const services = [
    {
        icon: Truck,
        title: "Pengiriman Cepat",
        desc: "Layanan pengiriman ekspres ke seluruh Indonesia.",
        color: "bg-rose-100 text-rose-600"
    },
    {
        icon: ShieldCheck,
        title: "Jaminan Asli",
        desc: "100% produk original dengan garansi uang kembali.",
        color: "bg-indigo-100 text-indigo-600"
    },
    {
        icon: Clock,
        title: "Layanan 24/7",
        desc: "Tim support kami siap membantu anda kapan saja.",
        color: "bg-blue-100 text-blue-600"
    },
    {
        icon: CreditCard,
        title: "Pembayaran Aman",
        desc: "Sistem pembayaran terenkripsi dan terpercaya.",
        color: "bg-teal-100 text-teal-600"
    },
    {
        icon: Star,
        title: "Kualitas Premium",
        desc: "Kurasi produk terbaik untuk kepuasan maksimal.",
        color: "bg-orange-100 text-orange-600"
    }
];

export function Services() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

    useEffect(() => {
        if (emblaApi) {
            // Auto play functionality could be added here
            const interval = setInterval(() => {
                if (emblaApi.canScrollNext()) {
                    emblaApi.scrollNext();
                } else {
                    emblaApi.scrollTo(0);
                }
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [emblaApi]);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-indigo-600 font-semibold tracking-wider uppercase text-sm">Kenapa Memilih Kami?</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-slate-800">Layanan Terbaik Untuk Anda</h2>
                    <div className="h-1 w-20 bg-rose-400 mx-auto rounded-full" />
                </div>

                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-6">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                className="flex-[0_0_100%] md:flex-[0_0_33.333%] min-w-0"
                                whileHover={{ y: -10 }}
                            >
                                <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-xl transition-shadow h-full">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.color}`}>
                                        <service.icon className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-slate-800">{service.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {service.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

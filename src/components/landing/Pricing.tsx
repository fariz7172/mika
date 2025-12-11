'use client';

import { Check } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "Gratis",
        desc: "Untuk pengguna baru yang ingin mencoba.",
        features: ["Akses Katalog Lengkap", "Wishlist Terbatas", "Support Standard"],
        popular: false,
        color: "border-slate-200 bg-white"
    },
    {
        name: "Member Pro",
        price: "Rp 50.000",
        period: "/bulan",
        desc: "Akses fitur eksklusif dan diskon spesial.",
        features: ["Diskon Member 10%", "Prioritas Pengiriman", "Akses Produk Limited", "Support 24/7"],
        popular: true,
        color: "border-indigo-100 bg-indigo-50/50"
    },
    {
        name: "Enterprise",
        price: "Rp 150.000",
        period: "/bulan",
        desc: "Untuk reseller dan pembelian grosir.",
        features: ["Harga Grosir", "Akun Manager Pribadi", "API Access", "Laporan Bulanan"],
        popular: false,
        color: "border-slate-200 bg-white"
    }
];

export function Pricing() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Paket Keanggotaan</h2>
                    <p className="text-slate-600">Pilih paket yang sesuai dengan kebutuhan belanja Anda.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl border ${plan.color} ${plan.popular ? 'shadow-xl scale-105 z-10' : 'shadow-sm hover:shadow-md'} transition-all`}
                        >
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                                    POPULAR
                                </div>
                            )}
                            <h3 className="text-lg font-semibold text-slate-800">{plan.name}</h3>
                            <div className="mt-4 flex items-baseline gap-1">
                                <span className="text-4xl font-bold tracking-tight text-slate-900">{plan.price}</span>
                                {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
                            </div>
                            <p className="mt-4 text-sm text-slate-600 pb-6 border-b border-slate-100 mb-6">{plan.desc}</p>
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex gap-3 text-sm text-slate-700">
                                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="h-3 w-3 text-green-600" />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`mt-8 w-full py-3 px-4 rounded-xl font-semibold transition-colors ${plan.popular
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                                    }`}
                            >
                                Pilih Paket
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

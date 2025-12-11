'use client';

import { useShopStore } from "@/store/useShopStore";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import this

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, clearCart } = useShopStore();
    const router = useRouter();
    const { data: session } = useSession();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const total = cart.reduce((acc, item) => acc + item.sellPrice * item.quantity, 0);

    const handleCheckout = async () => {
        if (!session) {
            router.push("/login");
            return;
        }

        setIsCheckingOut(true);

        try {
            // Create order in database
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart,
                    total: total * 1.11 // Including tax
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const { order } = await response.json();

            clearCart();
            router.push(`/invoice/${order.id}`);
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Terjadi kesalahan saat checkout. Silakan coba lagi.');
            setIsCheckingOut(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(price);
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="text-center md:max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500 mb-6">
                        <Trash2 className="h-10 w-10 opacity-50" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Keranjang Kosong</h1>
                    <p className="text-slate-500 mb-8">Wah, keranjang belanjaanmu masih sepi nih. Yuk isi dengan barang impianmu!</p>
                    <Link href="/products" className="block w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                        Mulai Belanja
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-8">Keranjang Belanja</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <div key={item.id} className="flex gap-6 border border-slate-100 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow items-center">
                                <div className="h-24 w-24 bg-slate-50 rounded-xl flex items-center justify-center text-xs text-center p-2 border border-slate-100 text-slate-400 font-medium">
                                    {item.name}
                                </div>
                                <div className="flex-1 flex flex-col justify-between h-24 py-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                                            <p className="text-sm text-slate-400">Variuan: Default</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>

                                    <div className="flex justify-between items-end mt-auto">
                                        <p className="font-bold text-indigo-600 text-lg">{formatPrice(item.sellPrice)}</p>
                                        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-600"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold text-slate-700">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-600"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="border border-slate-100 rounded-3xl p-6 bg-white shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold mb-6 text-slate-800">Ringkasan Pesanan</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">{formatPrice(total)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Pajak (11%)</span>
                                    <span className="font-medium">{formatPrice(total * 0.11)}</span>
                                </div>
                                <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-xl text-slate-900">
                                    <span>Total</span>
                                    <span>{formatPrice(total * 1.11)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full rounded-xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-indigo-300 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isCheckingOut ? "Memproses..." : "Checkout Sekarang"}
                            </button>
                            <p className="text-xs text-center text-slate-400 mt-4">
                                Transaksi aman dan terenkripsi 100%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

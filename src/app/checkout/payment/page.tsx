'use client';

import { useShopStore } from "@/store/useShopStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, CreditCard, Banknote, QrCode } from "lucide-react";
import { Suspense } from "react";
import Script from "next/script";

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useShopStore();

    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
    const [isSnapLoaded, setIsSnapLoaded] = useState(false);

    // Load Snap Script
    // Ideally this should be loaded once, maybe in layout or using next/script

    const handlePayment = async () => {
        if (!orderId) {
            alert("Order ID missing");
            return;
        }

        if (!isSnapLoaded) {
            alert("Payment gateway is loading, please wait...");
            return;
        }

        setStatus('processing');

        try {
            // Get Token
            const response = await fetch('/api/payment/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to get payment token");
            }

            // Open Snap
            const snap = (window as any).snap;
            if (!snap) {
                alert("Payment gateway not loaded yet. Please try again.");
                setStatus('idle');
                return;
            }

            snap.pay(data.token, {
                onSuccess: async function (result: any) {
                    console.log('success', result);
                    // Update order status
                    await updateOrderStatus('PAID');
                    setStatus('success');
                    // router.push(`/invoice/${orderId}`); // Navigate to invoice or show success
                },
                onPending: async function (result: any) {
                    console.log('pending', result);
                    await updateOrderStatus('PENDING'); // Or awaiting_payment
                    alert("Waktu pembayaran anda belum selesai. Silahkan selesaikan pembayaran.");
                    setStatus('idle');
                },
                onError: function (result: any) {
                    console.log('error', result);
                    alert("Pembayaran gagal!");
                    setStatus('error');
                },
                onClose: function () {
                    console.log('customer closed the popup without finishing the payment');
                    setStatus('idle');
                }
            });

        } catch (error: any) {
            console.error(error);
            alert(error.message);
            setStatus('error');
        }
    };

    const updateOrderStatus = async (newStatus: string) => {
        if (!orderId) return;
        try {
            await fetch('/api/orders/update-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            clearCart(); // Clear cart on success/pending if needed
        } catch (e) {
            console.error("Failed to update status", e);
        }
    };

    if (status === 'success') {
        return (
            <div className="container py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Pembayaran Berhasil!</h1>
                <p className="text-muted-foreground mb-8">Terima kasih telah berbelanja di Mika Shop.</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => router.push(`/invoice/${orderId}`)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700"
                    >
                        Lihat Invoice
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="bg-slate-100 text-slate-700 px-6 py-2 rounded-md font-medium hover:bg-slate-200"
                    >
                        Ke Dashboard
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-10 px-4 max-w-lg mx-auto">
            {/* Snap Script */}
            <Script
                src="https://app.sandbox.midtrans.com/snap/snap.js"
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
                strategy="lazyOnload"
                onLoad={() => setIsSnapLoaded(true)}
            />

            <h1 className="text-2xl font-bold mb-6 text-center">Pilih Metode Pembayaran</h1>

            <div className="space-y-4">
                <button
                    onClick={handlePayment}
                    disabled={status === 'processing' || !isSnapLoaded}
                    className="w-full flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                        <Banknote className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold">
                            {isSnapLoaded ? 'Bayar Sekarang (Midtrans)' : 'Memuat Metode Pembayaran...'}
                        </h3>
                        <p className="text-sm text-muted-foreground">Virtual Account, QRIS, Credit Card, dll</p>
                    </div>
                </button>

                {/* Other existing buttons can be removed or kept as dummies calling the same logic if they all go to Midtrans */}
            </div>

            {status === 'processing' && (
                <div className="text-center mt-8 text-muted-foreground animate-pulse">
                    Memproses pembayaran...
                </div>
            )}
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="container py-20 px-4 flex items-center justify-center">
                <div className="text-muted-foreground">Loading...</div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}

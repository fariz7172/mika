'use client';

import { useShopStore } from "@/store/useShopStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, CreditCard, Banknote, QrCode } from "lucide-react";
import { Suspense } from "react";

function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const { clearCart } = useShopStore();

    const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

    const handlePayment = async () => {
        setStatus('processing');

        // Simulate payment processing
        setTimeout(async () => {
            // Update order status to PAID
            if (orderId) {
                try {
                    const response = await fetch('/api/orders/update-status', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            orderId: orderId,
                            status: 'PAID'
                        })
                    });

                    if (response.ok) {
                        setStatus('success');
                    } else {
                        console.error('Failed to update order status');
                        setStatus('success'); // Still show success to user
                    }
                } catch (error) {
                    console.error('Error updating order status:', error);
                    setStatus('success'); // Still show success to user
                }
            } else {
                setStatus('success');
            }
        }, 2000);
    };

    if (status === 'success') {
        return (
            <div className="container py-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
                    <CheckCircle2 className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Pembayaran Berhasil!</h1>
                <p className="text-muted-foreground mb-8">Terima kasih telah berbelanja di Mika Shop.</p>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90"
                >
                    Lihat Pesanan Saya
                </button>
            </div>
        )
    }

    return (
        <div className="container py-10 px-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Pilih Metode Pembayaran</h1>

            <div className="space-y-4">
                <button
                    onClick={handlePayment}
                    disabled={status === 'processing'}
                    className="w-full flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                    <div className="h-10 w-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
                        <Banknote className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Transfer Bank (Virtual Account)</h3>
                        <p className="text-sm text-muted-foreground">BCA, Mandiri, BNI, BRI</p>
                    </div>
                </button>

                <button
                    onClick={handlePayment}
                    disabled={status === 'processing'}
                    className="w-full flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                    <div className="h-10 w-10 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full">
                        <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold">QRIS</h3>
                        <p className="text-sm text-muted-foreground">Gopay, OVO, Dana, ShopeePay</p>
                    </div>
                </button>

                <button
                    onClick={handlePayment}
                    disabled={status === 'processing'}
                    className="w-full flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                    <div className="h-10 w-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full">
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Kartu Kredit / Debit</h3>
                        <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                    </div>
                </button>
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

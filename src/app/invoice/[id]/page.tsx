import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { PrintButton } from "@/components/ui/PrintButton";

interface InvoicePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
        // Ideally redirect or show unauthorized
        // return <div>Unauthorized</div>;
    }

    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: true,
            items: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!order) {
        notFound();
    }

    // Formatters
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'full',
            timeStyle: 'short'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container px-4 max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8 print:hidden">
                    <Link href="/dashboard" className="text-slate-500 hover:text-slate-800 font-medium">
                        ← Kembali ke Dashboard
                    </Link>
                    <div className="flex gap-2">
                        <Link
                            href={`/invoice/${id}/receipt`}
                            className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-300 font-medium transition-colors"
                        >
                            <span className="text-sm">Struk Thermal (58mm)</span>
                        </Link>
                        <PrintButton />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border-none">
                    {/* Header */}
                    <div className="bg-slate-900 text-white p-8 flex justify-between items-start print:bg-slate-900 print:-webkit-print-color-adjust-exact">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                            <p className="text-slate-400">Order #{order.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-lg">Mika Shop</p>
                            <p className="text-sm text-slate-400">Jl. Teknologi No. 1</p>
                            <p className="text-sm text-slate-400">Jakarta, Indonesia</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ditagihkan Kepada</h3>
                                <p className="font-bold text-slate-800">{order.user.name}</p>
                                <p className="text-sm text-slate-600">{order.user.email}</p>
                                {order.address && <p className="text-sm text-slate-600 mt-1 max-w-xs">{order.address}</p>}
                                {order.phone && <p className="text-sm text-slate-600 mt-1">{order.phone}</p>}
                            </div>
                            <div className="md:text-right">
                                <div className="mb-4">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tanggal Order</h3>
                                    <p className="font-medium text-slate-800">{formatDate(order.createdAt)}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Status Pembayaran</h3>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${order.status === 'PAID' || order.status === 'COMPLETED' || order.status === 'SHIPPED'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                        } print:bg-white print:border print:border-slate-300 print:text-black`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="mb-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 text-sm font-bold text-slate-500 uppercase tracking-wider">Produk</th>
                                        <th className="text-center py-3 text-sm font-bold text-slate-500 uppercase tracking-wider">Qty</th>
                                        <th className="text-right py-3 text-sm font-bold text-slate-500 uppercase tracking-wider">Harga</th>
                                        <th className="text-right py-3 text-sm font-bold text-slate-500 uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-4 text-slate-800 font-medium">{item.product.name}</td>
                                            <td className="py-4 text-center text-slate-600">{item.quantity}</td>
                                            <td className="py-4 text-right text-slate-600">{formatCurrency(item.price)}</td>
                                            <td className="py-4 text-right text-slate-800 font-bold">{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="flex justify-end">
                            <div className="w-full md:w-1/3 space-y-3">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.total / 1.11)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Pajak (11%)</span>
                                    <span>{formatCurrency(order.total - (order.total / 1.11))}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-slate-900 border-t border-slate-100 pt-3">
                                    <span>Total Bayar</span>
                                    <span>{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 p-8 text-center text-slate-500 text-sm print:hidden">
                        <p>Terima kasih telah berbelanja di Mika Shop.</p>
                        <p className="mt-1">Invoice ini sah dan diproses oleh komputer.</p>
                    </div>
                </div>
            </div>
            {/* Print styles */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .bg-slate-50 {
                        background: white !important;
                    }
                    .container {
                        max-width: 100% !important;
                        padding: 0 !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .bg-white {
                        border: none !important;
                        box-shadow: none !important;
                        visibility: visible !important;
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .bg-white * {
                        visibility: visible !important;
                    }
                }
            `}</style>
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { PrintButton } from "@/components/ui/PrintButton";

interface ReceiptPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
    const { id } = await params;
    const session = await auth();

    if (!session?.user) {
        // Handle unauthorized
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
            day: 'numeric',
            month: 'numeric',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center py-10 print:bg-white print:py-0 print:block">
            <div className="w-[58mm] bg-white p-4 shadow-sm print:w-full print:shadow-none print:p-0">
                <div className="print:hidden mb-4 text-center">
                    <PrintButton />
                    <div className="text-xs text-slate-500 mt-2">
                        Pastikan ukuran kertas 58mm di pengaturan printer
                    </div>
                </div>

                <div className="text-[12px] print:text-[10px] font-mono leading-tight print:px-2">
                    {/* Header */}
                    <div className="text-center mb-4">
                        <h2 className="font-bold text-base">MIKA SHOP</h2>
                        <p>Jl. Teknologi No. 1</p>
                        <p>Jakarta</p>
                        <p className="mt-1">0812-3456-7890</p>
                    </div>

                    <div className="border-b border-dashed border-black my-2"></div>

                    {/* Order Info */}
                    <div className="mb-2">
                        <p>No: {order.id.slice(0, 8)}</p>
                        <p>{formatDate(order.createdAt)}</p>
                        <p>Cust: {order.user.name?.slice(0, 15)}</p>
                    </div>

                    <div className="border-b border-dashed border-black my-2"></div>

                    {/* Items */}
                    <div className="space-y-2">
                        {order.items.map((item) => (
                            <div key={item.id}>
                                <div className="font-bold">{item.product.name}</div>
                                <div className="flex justify-between">
                                    <span>{item.quantity} x {formatCurrency(item.price)}</span>
                                    <span>{formatCurrency(item.quantity * item.price)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-b border-dashed border-black my-2"></div>

                    {/* Totals */}
                    <div className="space-y-1">
                        <div className="flex justify-between">
                            <span>Total</span>
                            <span className="font-bold">{formatCurrency(order.total)}</span>
                        </div>
                        {/* Assuming Cash payment for now or generic */}
                        <div className="flex justify-between">
                            <span>Bayar</span>
                            <span>{formatCurrency(order.total)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Kembali</span>
                            <span>{formatCurrency(0)}</span>
                        </div>
                    </div>

                    <div className="border-b border-dashed border-black my-2"></div>

                    {/* Footer */}
                    <div className="text-center mt-4">
                        <p>Terima Kasih</p>
                        <p>Barang yang dibeli tidak dapat ditukar/dikembalikan</p>
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    @page {
                        size: 58mm auto;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    /* Hide header/footer enforced by browser if possible (requires user setting usually) */
                }
            `}</style>
        </div>
    );
}

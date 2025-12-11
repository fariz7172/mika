import Link from "next/link";
import { CheckCircle } from "lucide-react";

type Props = {
    params: Promise<{ id: string }>
}

export default async function InvoicePage(props: Props) {
    const params = await props.params;
    const { id } = params;

    return (
        <div className="container py-20 px-4 flex flex-col items-center justify-center gap-6 text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-full">
                <CheckCircle className="h-16 w-16 text-yellow-600 dark:text-yellow-400" />
            </div>

            <h1 className="text-4xl font-bold">Pesanan Dibuat!</h1>
            <p className="text-xl text-muted-foreground">
                Pesanan Anda dengan ID <span className="font-mono font-bold text-foreground">{id}</span> sedang menunggu pembayaran.
            </p>

            <div className="flex gap-4 mt-4">
                <Link href={`/checkout/payment?orderId=${id}`} className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                    Bayar Sekarang
                </Link>
                <Link href="/products" className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
                    Lanjut Belanja
                </Link>
                <Link href="/" className="rounded-md border bg-background px-6 py-3 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground">
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    );
}

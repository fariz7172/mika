import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
            items: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container px-4">
                {/* Welcome Header */}
                <div className="bg-gradient-to-br from-indigo-500 to-rose-400 rounded-3xl p-8 md:p-12 mb-8 text-white shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <span className="text-indigo-100 text-sm font-semibold tracking-wider uppercase">Member Area</span>
                            <h1 className="text-3xl md:text-4xl font-extrabold mt-1">Halo, {session.user.name}! 👋</h1>
                            <p className="text-indigo-50 mt-2">Selamat datang kembali di dashboard Anda</p>
                        </div>
                        <Link href="/products" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                            Belanja Lagi
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-sm font-bold">
                                    {session.user.name?.charAt(0).toUpperCase()}
                                </div>
                                Akun Saya
                            </h3>
                            <p className="text-sm text-slate-500 break-all mb-4">{session.user.email}</p>
                            <div className="border-t border-slate-100 pt-4 space-y-2">
                                <Link href="/" className="block text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                                    🏠 Ke Beranda
                                </Link>
                                <Link href="/products" className="block text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                                    🛍️ Katalog Produk
                                </Link>
                                <Link href="/wishlist" className="block text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors">
                                    ❤️ Wishlist
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Main Content: Order History */}
                    <div className="md:col-span-3">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Riwayat Pesanan</h2>
                            <span className="text-sm text-slate-500">{orders.length} pesanan</span>
                        </div>
                        <div className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="p-12 border border-dashed border-slate-200 rounded-3xl text-center bg-white">
                                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
                                        <span className="text-3xl">📦</span>
                                    </div>
                                    <p className="text-slate-500 font-medium mb-2">Belum ada pesanan</p>
                                    <p className="text-sm text-slate-400 mb-6">Yuk mulai belanja dan temukan produk favoritmu!</p>
                                    <Link href="/products" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                                        Mulai Belanja
                                    </Link>
                                </div>
                            ) : (
                                orders.map((order: any) => (
                                    <div key={order.id} className="border border-slate-100 rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-100">
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">No. Pesanan</p>
                                                <p className="font-mono font-bold text-slate-800 text-sm">#{order.id.slice(0, 8)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Tanggal</p>
                                                <p className="font-semibold text-slate-800 text-sm">{new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Total</p>
                                                <p className="font-bold text-indigo-600 text-sm">Rp {order.total.toLocaleString("id-ID")}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Status</p>
                                                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold bg-green-100 text-green-700">
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-700 mb-3">Item Pesanan</h4>
                                            <ul className="space-y-2">
                                                {order.items.map((item: any) => (
                                                    <li key={item.id} className="flex justify-between items-center text-sm bg-slate-50 p-3 rounded-lg">
                                                        <span className="text-slate-700">
                                                            {item.product.name} <span className="text-slate-400 font-medium">×{item.quantity}</span>
                                                        </span>
                                                        <span className="font-semibold text-slate-800">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                                            <Link href={`/invoice/${order.id}`} className="text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                                                Lihat Invoice →
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

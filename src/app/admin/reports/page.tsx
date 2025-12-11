import { prisma } from "@/lib/prisma";

export default async function AdminReportsPage() {
    // Basic stats
    const totalOrders = await prisma.order.count();
    const totalRevenue = await prisma.order.aggregate({
        _sum: { total: true }
    });
    const totalProducts = await prisma.product.count();
    const totalUsers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    // Recent sales
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Laporan Penjualan</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Pendapatan</h3>
                    <p className="text-2xl font-bold mt-2 text-primary">
                        Rp {(totalRevenue._sum.total || 0).toLocaleString('id-ID')}
                    </p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Pesanan</h3>
                    <p className="text-2xl font-bold mt-2">{totalOrders}</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Produk Terdaftar</h3>
                    <p className="text-2xl font-bold mt-2">{totalProducts}</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Pelanggan Aktif</h3>
                    <p className="text-2xl font-bold mt-2">{totalUsers}</p>
                </div>
            </div>

            <div className="bg-card rounded-md border p-6">
                <h2 className="text-xl font-bold mb-4">Penjualan Terakhir</h2>
                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">ID</th>
                            <th className="py-2">Pelanggan</th>
                            <th className="py-2">Total</th>
                            <th className="py-2">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map(order => (
                            <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                                <td className="py-2 font-mono text-muted-foreground">{order.id.slice(0, 8)}</td>
                                <td className="py-2">{order.user.name}</td>
                                <td className="py-2">Rp {order.total.toLocaleString('id-ID')}</td>
                                <td className="py-2">{new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                            </tr>
                        ))}
                        {recentOrders.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-4 text-center text-muted-foreground">Belum ada data penjualan.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

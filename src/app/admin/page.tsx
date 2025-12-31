import { prisma } from "@/lib/prisma";

async function getDashboardData() {
    const totalSales = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
            status: {
                in: ["PAID", "SHIPPED", "COMPLETED"]
            }
        }
    });

    const totalOrders = await prisma.order.count();

    // Count only active products (assumed stock > 0) or just all products
    const activeProducts = await prisma.product.count({
        where: {
            stock: { gt: 0 }
        }
    });

    const totalCustomers = await prisma.user.count({
        where: {
            role: "CUSTOMER"
        }
    });

    return {
        totalSales: totalSales._sum.total || 0,
        totalOrders,
        activeProducts,
        totalCustomers
    };
}

export default async function AdminDashboardPage() {
    const data = await getDashboardData();

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Penjualan</h3>
                    <p className="text-2xl font-bold mt-2">{formatCurrency(data.totalSales)}</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Pesanan</h3>
                    <p className="text-2xl font-bold mt-2">{data.totalOrders}</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Produk Aktif</h3>
                    <p className="text-2xl font-bold mt-2">{data.activeProducts}</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Pelanggan</h3>
                    <p className="text-2xl font-bold mt-2">{data.totalCustomers}</p>
                </div>
            </div>
        </div>
    );
}


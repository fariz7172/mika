import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { StatusSelect } from "@/components/admin/StatusSelect";

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            items: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    async function updateOrderStatus(formData: FormData) {
        "use server";
        const orderId = formData.get("orderId") as string;
        const status = formData.get("status") as string;

        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });

        revalidatePath("/admin/orders");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manajemen Pesanan</h1>
            <div className="bg-card rounded-md border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">ID Pesanan</th>
                            <th className="px-4 py-3 font-medium">Customer</th>
                            <th className="px-4 py-3 font-medium">Pengiriman</th>
                            <th className="px-4 py-3 font-medium">Total</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Tanggal</th>
                            <th className="px-4 py-3 font-medium">Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order: any) => (
                            <tr key={order.id} className="border-t hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 8)}</td>
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="font-medium">{order.user.name}</p>
                                        <p className="text-xs text-muted-foreground">{order.user.email}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 max-w-xs">
                                    <div className="text-sm">
                                        <p className="font-medium line-clamp-2">{order.address || "-"}</p>
                                        <p className="text-xs text-muted-foreground">{order.phone || "-"}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-semibold">Rp {order.total.toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3">
                                    <StatusSelect
                                        orderId={order.id}
                                        currentStatus={order.status}
                                        updateOrderStatus={updateOrderStatus}
                                    />
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                </td>
                                <td className="px-4 py-3">
                                    <details className="cursor-pointer">
                                        <summary className="text-primary hover:underline">
                                            {order.items.length} item(s)
                                        </summary>
                                        <ul className="mt-2 space-y-1 text-xs">
                                            {order.items.map((item: any) => (
                                                <li key={item.id}>
                                                    {item.product.name} x{item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                                    Belum ada pesanan
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

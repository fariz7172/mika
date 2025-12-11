import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN" && (session.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const totalSales = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                status: "COMPLETED" // Assuming COMPLETED status for sales
            }
        });

        const orderCount = await prisma.order.count();

        return NextResponse.json({
            totalSales: totalSales._sum.total || 0,
            totalOrders: orderCount
        });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}

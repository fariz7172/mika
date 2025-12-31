import { NextResponse } from "next/server";
import Midtrans from "midtrans-client";
import { auth } from "@/auth";

export async function POST(request: Request) {
    try {
        const session = await auth();
        // Loose auth for now, or ensure user is logged in
        // if (!session?.user) {
        //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        // }

        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
        }

        // Fetch Order
        const { prisma } = await import("@/lib/prisma"); // Lazy load prisma to avoid top-level issues if any
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Initialize Snap
        const snap = new Midtrans.Snap({
            isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
            serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-ciDtaoWkjXZZzuVoZDtgK-ct',
            clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-LKl27dNMBHZ4nF4d'
        });

        const parameter = {
            transaction_details: {
                order_id: order.id,
                gross_amount: Math.round(order.total)
            },
            credit_card: {
                secure: true
            },
            customer_details: {
                first_name: order.user?.name || "Customer",
                email: order.user?.email || "customer@example.com",
                phone: order.phone || ""
            }
        };

        const transaction = await snap.createTransaction(parameter);

        return NextResponse.json({
            token: transaction.token,
            redirect_url: transaction.redirect_url
        });

    } catch (error: any) {
        console.error("Midtrans Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

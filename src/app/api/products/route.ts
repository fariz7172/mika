import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    try {
        const where = category ? { category: { slug: category } } : {};
        const products = await prisma.product.findMany({
            where,
            include: { category: true }
        });
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "ADMIN" && (session.user as any)?.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const product = await prisma.product.create({
            data: {
                name: body.name,
                description: body.description,
                buyPrice: body.buyPrice,
                sellPrice: body.sellPrice,
                stock: body.stock,
                categoryId: body.categoryId, // Changed from category to categoryId
                images: body.images
            }
        });
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}

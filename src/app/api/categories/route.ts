import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    // Protect API
    if (!session || (session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, slug } = body;

        const category = await prisma.category.create({
            data: { name, slug }
        });

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const categories = await prisma.category.findMany();
    return NextResponse.json(categories);
}

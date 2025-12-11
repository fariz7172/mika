import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file received." },
                { status: 400 }
            );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + "_" + file.name.replaceAll(" ", "_");

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadDir)) {
            mkdirSync(uploadDir, { recursive: true });
        }

        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        // Return public URL
        const imageUrl = `/uploads/${filename}`;

        return NextResponse.json({ imageUrl });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json(
            { error: "Failed to upload file." },
            { status: 500 }
        );
    }
}

import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function NewProductPage() {
    const categories = await prisma.category.findMany();

    async function createProduct(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const buyPrice = Number(formData.get("buyPrice"));
        const sellPrice = Number(formData.get("sellPrice"));
        const stock = Number(formData.get("stock"));
        const categoryId = formData.get("categoryId") as string;
        const images = formData.get("images") as string;

        await prisma.product.create({
            data: {
                name,
                description,
                buyPrice,
                sellPrice,
                stock,
                categoryId: categoryId || null,
                images // Save image URL
            },
        });

        revalidatePath("/admin/products");
        revalidatePath("/products");
        redirect("/admin/products");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Tambah Produk Baru</h1>
            <ProductForm categories={categories} action={createProduct} />
        </div>
    );
}

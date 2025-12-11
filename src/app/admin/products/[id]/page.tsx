import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage(props: Props) {
    const params = await props.params;
    const { id } = params;

    const product = await prisma.product.findUnique({
        where: { id }
    });

    const categories = await prisma.category.findMany();

    if (!product) {
        return <div>Produk tidak ditemukan</div>;
    }

    async function updateProduct(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const buyPrice = Number(formData.get("buyPrice"));
        const sellPrice = Number(formData.get("sellPrice"));
        const stock = Number(formData.get("stock"));
        const categoryId = formData.get("categoryId") as string;
        const images = formData.get("images") as string;

        await prisma.product.update({
            where: { id },
            data: {
                name,
                description,
                buyPrice,
                sellPrice,
                stock,
                categoryId: categoryId || null,
                images
            },
        });

        revalidatePath("/admin/products");
        revalidatePath("/products");
        redirect("/admin/products");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Produk</h1>
            <ProductForm
                initialData={product}
                categories={categories}
                action={updateProduct}
            />
        </div>
    );
}

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton";

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    async function deleteProduct(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        await prisma.product.delete({ where: { id } });
        revalidatePath("/admin/products");
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manajemen Produk</h1>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90"
                >
                    <Plus className="h-4 w-4" /> Tambah Produk
                </Link>
            </div>

            {/* Products List */}
            <div className="bg-card rounded-md border overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Gambar</th>
                            <th className="px-4 py-3 font-medium">Nama</th>
                            <th className="px-4 py-3 font-medium">Kategori</th>
                            <th className="px-4 py-3 font-medium">Harga Beli</th>
                            <th className="px-4 py-3 font-medium">Harga Jual</th>
                            <th className="px-4 py-3 font-medium">Stok</th>
                            <th className="px-4 py-3 font-medium text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-t hover:bg-muted/50 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="relative h-10 w-10 text-xs overflow-hidden rounded bg-muted">
                                        {product.images ? (
                                            <Image
                                                src={product.images}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                No Img
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-medium">{product.name}</td>
                                <td className="px-4 py-3">
                                    {product.category ? (
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                                            {product.category.name}
                                        </span>
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">Rp {product.buyPrice.toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3">Rp {product.sellPrice.toLocaleString('id-ID')}</td>
                                <td className="px-4 py-3">
                                    <span className={product.stock < 5 ? "text-orange-500 font-bold" : ""}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/products/${product.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                        <form action={deleteProduct}>
                                            <input type="hidden" name="id" value={product.id} />
                                            <DeleteButton />
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {products.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-lg font-semibold">Belum ada produk</p>
                                        <p className="text-sm">Mulai dengan menambahkan produk baru.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

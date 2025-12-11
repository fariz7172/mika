'use client';

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X } from "lucide-react";

type Category = {
    id: string;
    name: string;
};

type Product = {
    id?: string;
    name: string;
    description: string | null;
    buyPrice: number;
    sellPrice: number;
    stock: number;
    categoryId: string | null;
    images: string | null;
};

interface ProductFormProps {
    initialData?: Product;
    categories: Category[];
    action: (formData: FormData) => Promise<void>; // Server action wrapper
}

export function ProductForm({ initialData, categories, action }: ProductFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.images || null);
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setImageUrl(data.imageUrl);
        } catch (error) {
            console.error(error);
            alert("Gagal mengupload gambar");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = () => {
        setImageUrl(null);
    };

    const handleSubmit = async (formData: FormData) => {
        if (imageUrl) {
            formData.set("images", imageUrl);
        }

        startTransition(async () => {
            await action(formData);
        });
    };

    return (
        <form action={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border shadow-sm">
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <div className="space-y-4">
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium mb-2">Gambar Produk</label>
                    {imageUrl ? (
                        <div className="relative w-40 h-40 border rounded-md overflow-hidden group">
                            <Image
                                src={imageUrl}
                                alt="Product"
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Klik untuk upload gambar</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    )}
                    {uploading && <p className="text-sm text-muted-foreground mt-2">Mengupload...</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Nama Produk</label>
                        <input
                            name="name"
                            defaultValue={initialData?.name}
                            required
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Kategori</label>
                        <select
                            name="categoryId"
                            defaultValue={initialData?.categoryId || ""}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                        >
                            <option value="">Pilih Kategori</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Deskripsi</label>
                    <textarea
                        name="description"
                        defaultValue={initialData?.description || ""}
                        rows={3}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Harga Beli</label>
                        <input
                            name="buyPrice"
                            type="number"
                            defaultValue={initialData?.buyPrice}
                            required
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Harga Jual</label>
                        <input
                            name="sellPrice"
                            type="number"
                            defaultValue={initialData?.sellPrice}
                            required
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stok</label>
                        <input
                            name="stock"
                            type="number"
                            defaultValue={initialData?.stock}
                            required
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => router.push("/admin/products")}
                    className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent"
                    disabled={isPending}
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    disabled={isPending || uploading}
                >
                    {isPending ? "Menyimpan..." : "Simpan Produk"}
                </button>
            </div>
        </form>
    );
}

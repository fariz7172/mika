'use client';

import { useShopStore } from "@/store/useShopStore";
import { ProductCard } from "@/components/product/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
    const { wishlist } = useShopStore();

    if (wishlist.length === 0) {
        return (
            <div className="container py-20 px-4 flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Wishlist Saya</h1>
                <p className="text-muted-foreground">Belum ada item yang disukai.</p>
                <Link href="/products" className="text-primary hover:underline">
                    Cari Produk
                </Link>
            </div>
        )
    }

    return (
        <div className="container py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Wishlist Saya</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}

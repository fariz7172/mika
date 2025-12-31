'use client';

import NextImage from "next/image";
import Link from "next/link";
import { Product } from "@/types";

import { ShoppingCart, Heart } from "lucide-react";
import { useShopStore } from "@/store/useShopStore";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useShopStore();
    const { data: session } = useSession();

    const isWishlisted = isInWishlist(product.id);
    const isLowStock = product.stock > 0 && product.stock < 5;
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = () => {
        // Validation: Admin/Super Admin
        const role = (session?.user as any)?.role;
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            alert("Admin tidak bisa melakukan pembelian barang!");
            return;
        }

        const success = addToCart(product);
        if (!success) {
            alert("Stok barang tidak mencukupi untuk menambah jumlah!");
        }
    };

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-xl hover:-translate-y-1">
            <Link href={`/products/${product.id}`} className="aspect-square bg-white relative overflow-hidden block">
                {/* Category Badge */}
                {product.category && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-sm text-slate-700 shadow-sm">
                        {product.category.name}
                    </span>
                )}

                {/* Image */}
                {product.images ? (
                    <NextImage
                        src={product.images}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300 bg-slate-50 font-medium">
                        {product.name}
                    </div>
                )}

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                        <span className="bg-slate-900 text-white px-4 py-2 text-xs font-bold rounded-full tracking-wide">STOK HABIS</span>
                    </div>
                )}
            </Link>
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-2">
                    <h3 className="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[2.5em]">{product.description}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-50">
                    <div className="flex items-end justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-400 font-medium uppercase">Harga</span>
                            <span className="text-lg font-extrabold text-slate-900">{formatPrice(product.sellPrice)}</span>
                        </div>
                        {isLowStock && (
                            <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-md">
                                Sisa {product.stock}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-200 transition-all hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart className="h-4 w-4" /> Beli
                        </button>
                        <button
                            onClick={toggleWishlist}
                            className={cn(
                                "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 active:scale-95",
                                isWishlisted && "border-rose-200 bg-rose-50 text-rose-500"
                            )}
                        >
                            <Heart className={cn("h-4 w-4", isWishlisted ? "fill-current" : "text-slate-400")} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

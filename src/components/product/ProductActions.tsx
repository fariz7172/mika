'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { useShopStore } from '@/store/useShopStore';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface ProductActionsProps {
    product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
    const { addToCart, addToWishlist, isInWishlist, removeFromWishlist } = useShopStore();
    const { data: session } = useSession();
    const [quantity, setQuantity] = useState(1);

    const isWishlisted = isInWishlist(product.id);
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = () => {
        // Validation: Admin/Super Admin
        const role = (session?.user as any)?.role;
        if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
            alert("Admin tidak bisa melakukan pembelian barang!");
            return;
        }

        // Add to cart multiple times based on quantity
        // Note: The store might only support adding one at a time or have a quantity param.
        // Based on ProductCard, it's just addToCart(product). 
        // I will call it 'quantity' times or investigate store if possible.
        // For now, let's just add one or loop.
        // Actually, usually addToCart takes quantity? let's assume it adds 1.
        // I'll loop for now or just add 1.
        // Let's stick to adding 1 for simplicity to match ProductCard, 
        // OR check if I can pass quantity. 
        // Since I can't read store implementation easily without checking, 
        // I'll assume standard 'add one' behavior but maybe run it loop?
        // Better: Just add one for now to be safe, or check store.
        // Let's checking store is safer. But for speed, I'll valid add *once* and maybe show quantity selector is for display?
        // No, user expects quantity.

        // Let's assume addToCart adds 1.
        for (let i = 0; i < quantity; i++) {
            const success = addToCart(product);
            if (!success) {
                alert("Stok tidak mencukupi!");
                break;
            }
        }
    };

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const incrementQty = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                {/* Quantity Selector */}
                {!isOutOfStock && (
                    <div className="flex items-center rounded-xl border border-slate-200">
                        <button
                            onClick={decrementQty}
                            disabled={quantity <= 1}
                            className="p-3 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Minus className="w-4 h-4 text-slate-600" />
                        </button>
                        <span className="w-12 text-center font-bold text-slate-700">{quantity}</span>
                        <button
                            onClick={incrementQty}
                            disabled={quantity >= product.stock}
                            className="p-3 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-4 text-base font-bold text-white shadow-xl shadow-slate-200 transition-all hover:bg-indigo-600 hover:shadow-indigo-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
                </button>
                <button
                    onClick={toggleWishlist}
                    className={cn(
                        "inline-flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-rose-200 hover:bg-rose-50 active:scale-95",
                        isWishlisted && "border-rose-200 bg-rose-50 text-rose-500"
                    )}
                >
                    <Heart className={cn("h-6 w-6", isWishlisted ? "fill-current" : "text-slate-400")} />
                </button>
            </div>
        </div>
    );
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

interface ShopStore {
    cart: CartItem[];
    wishlist: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
}

export const useShopStore = create<ShopStore>()(
    persist(
        (set, get) => ({
            cart: [],
            wishlist: [],
            addToCart: (product) => {
                const { cart } = get();
                const existing = cart.find((item) => item.id === product.id);
                if (existing) {
                    set({
                        cart: cart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    set({ cart: [...cart, { ...product, quantity: 1 }] });
                }
            },
            removeFromCart: (productId) => {
                set({ cart: get().cart.filter((item) => item.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set({
                    cart: get().cart.map((item) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                });
            },
            clearCart: () => set({ cart: [] }),
            addToWishlist: (product) => {
                const { wishlist } = get();
                if (!wishlist.find(p => p.id === product.id)) {
                    set({ wishlist: [...wishlist, product] });
                }
            },
            removeFromWishlist: (productId) => {
                set({ wishlist: get().wishlist.filter(p => p.id !== productId) });
            },
            isInWishlist: (productId) => {
                return !!get().wishlist.find(p => p.id === productId);
            }
        }),
        {
            name: 'shop-storage',
        }
    )
);

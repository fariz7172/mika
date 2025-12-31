import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types';

interface ShopStore {
    cart: CartItem[];
    wishlist: Product[];
    addToCart: (product: Product) => boolean; // Return success status
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
                    if (existing.quantity + 1 > product.stock) {
                        return false; // Stock limit reached
                    }
                    set({
                        cart: cart.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    if (product.stock < 1) return false; // Should not happen if UI disabled, but safety check
                    set({ cart: [...cart, { ...product, quantity: 1 }] });
                }
                return true;
            },
            removeFromCart: (productId) => {
                set({ cart: get().cart.filter((item) => item.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                const { cart } = get();
                const item = cart.find((p) => p.id === productId);

                if (!item) return;

                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }

                // Check stock limit
                // We need the original product stock. stored in CartItem? 
                // Currently CartItem usually extends Product. Let's assume item has 'stock' property from Product
                if (quantity > item.stock) {
                    // Cannot update beyond stock
                    // Optionally force set to max stock?
                    // set({ cart: cart.map(i => i.id === productId ? { ...i, quantity: i.stock } : i) });
                    return;
                }

                set({
                    cart: cart.map((i) =>
                        i.id === productId ? { ...i, quantity } : i
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

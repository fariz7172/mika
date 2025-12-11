'use client';

import Link from "next/link";
import { ShoppingCart, User, Search, Menu, Heart, X, LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartCount } from "./CartCount";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

import { usePathname, useRouter } from "next/navigation";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { data: session } = useSession();
    const pathname = usePathname();

    const router = useRouter();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const term = e.currentTarget.value;
            if (term) {
                router.push(`/products?q=${encodeURIComponent(term)}`);
            } else {
                router.push("/products");
            }
        }
    };

    // Hide Header on Admin Dashboard routes
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            ShopApp
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/" className="transition-colors hover:text-foreground">
                        Beranda
                    </Link>
                    <Link href="/products" className="transition-colors hover:text-foreground">
                        Produk
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Cari produk..."
                            onKeyDown={handleSearch}
                            className="flex h-9 w-64 rounded-md border border-input bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <Link href="/cart" className="relative size-9 flex justify-center items-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                        <ShoppingCart className="h-5 w-5" />
                        <CartCount />
                    </Link>

                    <Link href="/wishlist" className="relative size-9 flex justify-center items-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Heart className="h-5 w-5" />
                    </Link>

                    {session ? (
                        <div className="flex items-center gap-2">
                            <Link href="/dashboard" className="text-sm font-medium hidden md:block hover:underline">
                                {session.user?.name}
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="size-9 flex justify-center items-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                                title="Keluar"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="size-9 flex justify-center items-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                            title="Masuk"
                        >
                            <LogIn className="h-5 w-5" />
                        </Link>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden size-9 flex justify-center items-center rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={toggleMenu}
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 bg-background">
                    <nav className="flex flex-col gap-4">
                        <Link href="/" onClick={toggleMenu} className="text-sm font-medium transition-colors hover:text-foreground">
                            Beranda
                        </Link>
                        <Link href="/products" onClick={toggleMenu} className="text-sm font-medium transition-colors hover:text-foreground">
                            Produk
                        </Link>
                        {!session && (
                            <Link href="/login" onClick={toggleMenu} className="text-sm font-medium text-primary">
                                Masuk / Daftar
                            </Link>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

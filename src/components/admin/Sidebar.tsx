'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
    LayoutDashboard,
    Package,
    Tag,
    ShoppingBag,
    FileText,
    Menu,
    X,
    LogOut,
    User,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produk", href: "/admin/products", icon: Package },
    { name: "Kategori", href: "/admin/categories", icon: Tag },
    { name: "Pesanan", href: "/admin/orders", icon: ShoppingBag },
    { name: "Laporan", href: "/admin/reports", icon: FileText },
];

export function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const toggleMenu = () => setIsOpen(!isOpen);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="mb-8 px-2 flex justify-between items-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Admin Panel
                </h2>
                <button onClick={toggleMenu} className="md:hidden p-2">
                    <X className="h-6 w-6" />
                </button>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-md transition-colors font-medium",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t pt-4">
                <div className="flex items-center gap-3 px-2 mb-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                            {session?.user?.name || "Admin"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {(session?.user as any)?.role || "Role"}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-3 px-4 py-2 rounded-md transition-colors text-destructive hover:bg-destructive/10 font-medium"
                >
                    <LogOut className="h-5 w-5" />
                    Keluar
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header Trigger */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b bg-background flex items-center px-4 z-40">
                <button onClick={toggleMenu} className="p-2 -ml-2">
                    <Menu className="h-6 w-6" />
                </button>
                <span className="font-bold text-lg ml-2">Admin Panel</span>
            </div>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-50"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-card border-r transition-transform duration-300 ease-in-out p-4 overflow-y-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
                    "mt-16 md:mt-0" // Push down for mobile header, reset for desktop
                )}
            >
                <SidebarContent />
            </aside>
        </>
    );
}

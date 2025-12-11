'use client';

import { useShopStore } from "@/store/useShopStore";
import { useEffect, useState } from "react";

export function CartCount() {
    const { cart } = useShopStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const count = cart.reduce((acc, item) => acc + item.quantity, 0);

    if (count === 0) return null;

    return (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            {count}
        </span>
    );
}

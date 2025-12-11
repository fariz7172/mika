'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";


// To avoid adding new deps, I'll use simple onChange.

export function ProductFilters({ categories }: { categories: { id: string, name: string, slug: string }[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = (term: string) => {
        startTransition(() => {
            router.push(`/products?${createQueryString("q", term)}`);
        });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        startTransition(() => {
            router.push(`/products?${createQueryString("category", e.target.value)}`);
        });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    defaultValue={searchParams.get("q")?.toString()}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
            </div>
            <div className="w-full sm:w-[200px]">
                <select
                    defaultValue={searchParams.get("category")?.toString()}
                    onChange={handleCategoryChange}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    <option value="">Semua Kategori</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters } from "@/components/product/ProductFilters";
import { prisma } from "@/lib/prisma";

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>;
}) {
    const params = await searchParams;
    const query = params.q;
    const categorySlug = params.category;

    const categories = await prisma.category.findMany();

    const where: any = {};

    if (query) {
        where.name = { contains: query }; // Case insensitive usually depends on DB, SQLite is case-insensitive for ASCII by default
    }

    if (categorySlug) {
        where.category = { slug: categorySlug };
    }

    const products = await prisma.product.findMany({
        where,
        include: { category: true }
    });

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <span className="text-indigo-600 font-bold tracking-wider uppercase text-xs mb-2 block">Koleksi Terbaru</span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">Katalog Produk</h1>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
                    <ProductFilters categories={categories} />
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {products.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 mb-4">
                            <span className="text-2xl">🔍</span>
                        </div>
                        <p className="text-slate-500 mb-2 font-medium">Produk tidak ditemukan.</p>
                        {(query || categorySlug) && (
                            <p className="text-sm text-slate-400">Coba kata kunci atau kategori lain.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

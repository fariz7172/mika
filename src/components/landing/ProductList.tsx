import { ProductCard } from "@/components/product/ProductCard";

import { Product } from "@/types";

interface ProductListProps {
    products: Product[];
}

export function ProductList({ products }: ProductListProps) {
    return (
        <section className="py-16 bg-white">
            <div className="container px-4">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Produk Terbaru</h2>
                    <p className="text-slate-600">Temukan koleksi produk terbaru kami dengan penawaran terbaik.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}


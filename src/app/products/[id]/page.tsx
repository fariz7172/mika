import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NextImage from "next/image";
import { ProductActions } from "@/components/product/ProductActions";
// import { Product } from "@/types"; // Check if I need to cast or if prisma return is compatible

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: true }
    });

    if (!product) {
        notFound();
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container px-4 md:px-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image Section */}
                        <div className="relative aspect-square md:aspect-auto md:h-[600px] bg-white p-8 border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center">
                            {product.images ? (
                                <NextImage
                                    src={product.images}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4"
                                    priority
                                />
                            ) : (
                                <div className="text-4xl font-bold text-slate-200">{product.name}</div>
                            )}
                        </div>

                        {/* Info Section */}
                        <div className="p-8 md:p-12 flex flex-col">
                            {product.category && (
                                <span className="inline-block w-fit mb-4 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold tracking-wider uppercase text-indigo-600">
                                    {product.category.name}
                                </span>
                            )}

                            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 lh-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-3xl font-extrabold text-slate-900">
                                    {formatPrice(product.sellPrice)}
                                </span>
                                {product.stock > 0 && product.stock < 5 && (
                                    <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">
                                        Sisa {product.stock}
                                    </span>
                                )}
                            </div>

                            <div className="prose prose-slate prose-sm mb-8 text-slate-500 leading-relaxed">
                                <p>{product.description}</p>
                            </div>

                            <div className="mt-auto">
                                <ProductActions product={product as any} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

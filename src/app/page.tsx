import { Hero } from "@/components/landing/Hero";
import { Services } from "@/components/landing/Services";
import { Pricing } from "@/components/landing/Pricing";
import { ProductList } from "@/components/landing/ProductList";
import { prisma } from "@/lib/prisma";

async function getLatestProducts() {
  const products = await prisma.product.findMany({
    take: 8,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: true
    }
  });
  return products;
}

export default async function Home() {
  const products = await getLatestProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ProductList products={products} />
      <Services />
      <Pricing />
    </div>
  )
}

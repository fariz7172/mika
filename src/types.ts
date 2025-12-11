export type Product = {
    id: string;
    name: string;
    description: string | null;
    buyPrice: number;
    sellPrice: number;
    stock: number;
    categoryId: string | null;
    category: { name: string; slug: string } | null;
    images: string | null;
};

export type CartItem = Product & {
    quantity: number;
};

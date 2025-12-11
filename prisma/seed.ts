import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // 1. Create Users
    const superAdmin = await prisma.user.upsert({
        where: { email: 'superadmin@toko.com' },
        update: { password },
        create: {
            email: 'superadmin@toko.com',
            name: 'Super Admin',
            password: 'password123',
            role: 'SUPER_ADMIN',
        },
    })

    const admin = await prisma.user.upsert({
        where: { email: 'admin@toko.com' },
        update: { password },
        create: {
            email: 'admin@toko.com',
            name: 'Admin Toko',
            password,
            role: 'ADMIN',
        },
    })

    const customer = await prisma.user.upsert({
        where: { email: 'customer@toko.com' },
        update: { password },
        create: {
            email: 'customer@toko.com',
            name: 'Pelanggan Setia',
            password,
            role: 'CUSTOMER',
        },
    })

    console.log("Users seeded.");

    // 2. Create Categories
    const sepatu = await prisma.category.upsert({
        where: { slug: 'sepatu' },
        update: {},
        create: { name: 'Sepatu', slug: 'sepatu' }
    });

    const pakaian = await prisma.category.upsert({
        where: { slug: 'pakaian' },
        update: {},
        create: { name: 'Pakaian', slug: 'pakaian' }
    });

    const aksesoris = await prisma.category.upsert({
        where: { slug: 'aksesoris' },
        update: {},
        create: { name: 'Aksesoris', slug: 'aksesoris' }
    });

    console.log("Categories seeded.");

    // 3. Create Products linked to Categories
    const products = [
        {
            name: "Sepatu Nike Air Jordan",
            description: "Sepatu sneakers kekinian.",
            buyPrice: 1500000,
            sellPrice: 2000000,
            stock: 10,
            categoryId: sepatu.id,
            images: "https://images.unsplash.com/photo-1603302576837-37561b2e2302"
        },
        {
            name: "Kemeja Flannel Uniqlo",
            description: "Kemeja nyaman dipakai.",
            buyPrice: 200000,
            sellPrice: 299000,
            stock: 50,
            categoryId: pakaian.id,
            images: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633"
        },
        {
            name: "Jam Tangan Casio",
            description: "Jam tangan digital klasik.",
            buyPrice: 300000,
            sellPrice: 450000,
            stock: 25,
            categoryId: aksesoris.id,
            images: "https://images.unsplash.com/photo-1598327105666-5b89351aff23"
        }
    ];

    for (const p of products) {
        const existing = await prisma.product.findFirst({ where: { name: p.name } })
        if (!existing) {
            await prisma.product.create({
                data: p
            })
        }
    }

    console.log("Products seeded.");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

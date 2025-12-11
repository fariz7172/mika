import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminCategoriesPage() {
    const categories = await prisma.category.findMany();

    async function createCategory(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;

        await prisma.category.create({
            data: { name, slug },
        });
        revalidatePath("/admin/categories");
    }

    async function deleteCategory(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        await prisma.category.delete({ where: { id } });
        revalidatePath("/admin/categories");
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manajemen Kategori</h1>

            {/* Add Category Form */}
            <div className="p-4 bg-card rounded-md border max-w-md">
                <h2 className="text-xl font-semibold mb-4">Tambah Kategori</h2>
                <form action={createCategory} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nama Kategori</label>
                        <input
                            name="name"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Slug</label>
                        <input
                            name="slug"
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90"
                    >
                        Simpan
                    </button>
                </form>
            </div>

            {/* Categories List */}
            <div className="bg-card rounded-md border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground">
                        <tr>
                            <th className="px-4 py-3 font-medium">Nama</th>
                            <th className="px-4 py-3 font-medium">Slug</th>
                            <th className="px-4 py-3 font-medium text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-t hover:bg-muted/50">
                                <td className="px-4 py-3 font-medium">{category.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{category.slug}</td>
                                <td className="px-4 py-3 text-right">
                                    <form action={deleteCategory}>
                                        <input type="hidden" name="id" value={category.id} />
                                        <button type="submit" className="text-destructive hover:underline">Hapus</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                    Belum ada kategori.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

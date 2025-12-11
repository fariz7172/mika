import { Sidebar } from "@/components/admin/Sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Protect Admin Route
    if (!session || (session.user as any).role !== "ADMIN" && (session.user as any).role !== "SUPER_ADMIN") {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 p-8 bg-muted/20 mt-16 md:mt-0">
                {children}
            </main>
        </div>
    );
}

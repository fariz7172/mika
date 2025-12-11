export default function AdminDashboardPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Penjualan</h3>
                    <p className="text-2xl font-bold mt-2">Rp 0</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Pesanan</h3>
                    <p className="text-2xl font-bold mt-2">0</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Produk Aktif</h3>
                    <p className="text-2xl font-bold mt-2">0</p>
                </div>
                <div className="p-6 bg-card rounded-lg shadow-sm border">
                    <h3 className="text-sm font-medium text-muted-foreground">Pelanggan</h3>
                    <p className="text-2xl font-bold mt-2">0</p>
                </div>
            </div>
        </div>
    );
}

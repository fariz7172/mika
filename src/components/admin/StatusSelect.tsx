'use client';

interface StatusSelectProps {
    orderId: string;
    currentStatus: string;
    updateOrderStatus: (formData: FormData) => Promise<void>;
}

export function StatusSelect({ orderId, currentStatus, updateOrderStatus }: StatusSelectProps) {
    const getStatusColor = (status: string) => {
        const colors = {
            'PENDING': { bg: '#fef3c7', text: '#92400e' },
            'PAID': { bg: '#d1fae5', text: '#065f46' },
            'SHIPPED': { bg: '#bfdbfe', text: '#1e40af' },
            'DELIVERED': { bg: '#d1fae5', text: '#065f46' },
            'CANCELLED': { bg: '#fee2e2', text: '#991b1b' }
        };
        return colors[status as keyof typeof colors] || { bg: '#f3f4f6', text: '#374151' };
    };

    const colors = getStatusColor(currentStatus);

    return (
        <form action={updateOrderStatus}>
            <input type="hidden" name="orderId" value={orderId} />
            <select
                name="status"
                defaultValue={currentStatus}
                onChange={(e) => e.currentTarget.form?.requestSubmit()}
                className="px-3 py-1.5 text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-primary cursor-pointer"
                style={{
                    backgroundColor: colors.bg,
                    color: colors.text
                }}
            >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
            </select>
        </form>
    );
}

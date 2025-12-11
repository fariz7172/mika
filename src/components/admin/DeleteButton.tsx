'use client';

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton() {
    // using hook to potentially show loading state if needed, though mostly just for the onClick logic here
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            title="Hapus"
            onClick={(e) => {
                if (!confirm("Yakin ingin menghapus produk ini?")) {
                    e.preventDefault();
                }
            }}
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}

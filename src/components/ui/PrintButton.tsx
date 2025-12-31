'use client';

import { Printer } from "lucide-react";

export function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 font-medium transition-colors"
        >
            <Printer size={18} />
            <span className="cursor-pointer">Cetak Invoice</span>
        </button>
    );
}

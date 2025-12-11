import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-6 md:py-0">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        &copy; 2025 ShopApp. Built by Antigravity.
                    </p>
                </div>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <Link href="/terms" className="hover:underline underline-offset-4">
                        Syarat & Ketentuan
                    </Link>
                    <Link href="/privacy" className="hover:underline underline-offset-4">
                        Kebijakan Privasi
                    </Link>
                </div>
            </div>
        </footer>
    );
}

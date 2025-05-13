import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type AdminLayoutProps = {
    children: ReactNode;
    title?: string;
};

export default function AdminLayout({ children, title = "Admin Dashboard" }: AdminLayoutProps) {
    const { data: session } = useSession();
    const username = session?.user?.name || "Artisan";

    // Apply dynamic header height adjustments for admin layout
    useEffect(() => {
        const adminHeader = document.querySelector('.admin-header') as HTMLElement;
        
        const adjustAdminHeaderPosition = () => {
            if (adminHeader) {
                adminHeader.style.top = `var(--current-header-height)`;
            }
        };
        
        // Initial adjustment
        adjustAdminHeaderPosition();
        
        // Re-adjust on scroll
        window.addEventListener('scroll', adjustAdminHeaderPosition);
        
        return () => {
            window.removeEventListener('scroll', adjustAdminHeaderPosition);
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-brandIvory" style={{ paddingTop: 'var(--current-header-height)' }}>
            {/* Admin Header - uses dynamic spacing */}
            <header className="admin-header bg-white/50 backdrop-blur-sm border-b border-brandGold/20 shadow-subtle fixed left-0 right-0 z-10" style={{ top: 'var(--current-header-height)' }}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <Link href="/admin" className="flex items-center space-x-3">
                            <div className="relative w-8 h-8">
                                <Image 
                                    src="/logo1.jpeg" 
                                    alt="Diamant Rouge" 
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h1 className="text-xl font-serif text-brandGold">Maison Diamant Rouge</h1>
                        </Link>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-platinumGray">
                            Bienvenue, <span className="text-brandGold">{username}</span>
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content Area - add padding to account for admin header */}
            <main className="flex-grow container mx-auto px-6 py-8 pt-32 md:pt-36">
                {children}
            </main>
        </div>
    );
} 
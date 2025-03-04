// components/Footer.tsx
import Link from "next/link";
import Newsletter from "./Newsletter";

export default function Footer() {
    return (
        <footer className="section-dark py-8 mt-auto">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
                
                {/* Branding */}
                <p className="mb-4 md:mb-0 font-serif text-sm tracking-wide">
                    © {new Date().getFullYear()} Diamant-Rouge. The House of Eternal Luxury.
                </p>

                {/* Quick Links */}
                <nav className="flex gap-6 text-sm">
                    <Link
                        href="/about"
                        className="hover:text-brandGold transition-colors"
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className="hover:text-brandGold transition-colors"
                    >
                        Contact
                    </Link>
                    <Link
                        href="/faq"
                        className="hover:text-brandGold transition-colors"
                    >
                        FAQ
                    </Link>
                </nav>
            </div>
        </footer>
    );
}

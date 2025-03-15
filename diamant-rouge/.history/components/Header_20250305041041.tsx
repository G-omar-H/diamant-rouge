import { useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

export default function Header() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="text-xl font-bold">
          <Link href="/">Diamant Rouge</Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link href="/collections" className="hover:text-brandGold">
            Collections
          </Link>
          <Link href="/appointments" className="hover:text-brandGold">
            Rendez-vous
          </Link>
          <Link href="/the-house" className="hover:text-brandGold">
            La Maison
          </Link>
          <Link href="/contact" className="hover:text-brandGold">
            Contact
          </Link>
        </nav>

        <button
          className="md:hidden focus:outline-none"
          aria-label="Toggle Menu"
          onClick={() => setNavOpen(!navOpen)}
        >
          {navOpen ? <AiOutlineClose size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {navOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="flex flex-col px-4 py-2">
            <Link
              href="/collections"
              className="py-2 text-richEbony hover:text-brandGold"
              onClick={() => setNavOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/appointments"
              className="py-2 text-richEbony hover:text-brandGold"
              onClick={() => setNavOpen(false)}
            >
              Rendez-vous
            </Link>
            <Link
              href="/the-house"
              className="py-2 text-richEbony hover:text-brandGold"
              onClick={() => setNavOpen(false)}
            >
              La Maison
            </Link>
            <Link
              href="/contact"
              className="py-2 text-richEbony hover:text-brandGold"
              onClick={() => setNavOpen(false)}
            >
              Contact
            </Link>
          </div>
          <div className="flex-1" onClick={() => setNavOpen(false)} />
        </div>
      )}
    </header>
  );
}
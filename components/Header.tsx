'use client';
import Link from "next/link";
function Header() {
    return (
        <nav className="flex items-center justify-between bg-white px-8 py-4 shadow">
            <Link href="/" className="text-xl font-bold text-blue-600">
            Toko Online
            </Link>
            <div className="flex gap-6">
                <Link href="/"className="text-gray-700 hover:text-blue-600">
                Beranda
                </Link>
                <Link href="/tentang" className="text-gray-700 hover:text-blue-600">
                Tentang
                </Link>
            </div>
        </nav>
    );
}

export default Header;

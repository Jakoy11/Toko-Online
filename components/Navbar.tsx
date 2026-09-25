import Link from "next/link";
import { auth, signOut } from "@/lib/auth"; // Import signOut dari auth.ts

export default async function Navbar() {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b bg-white">
      <Link href="/" className="text-xl font-bold text-black">
        Toko Online
      </Link>

      <div className="flex items-center space-x-6 text-sm font-medium">
        <Link href="/" className="hover:text-blue-600">
          Produk
        </Link>
        <Link href="/keranjang" className="hover:text-blue-600">
          Keranjang
        </Link>
        <Link href="/pesanan" className="hover:text-blue-600">
          Pesanan Saya
        </Link>

        {role === "ADMIN" && (
          <Link href="/admin/produk" className="text-blue-600 font-bold hover:underline">
            Admin
          </Link>
        )}

        {session?.user ? (
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Halo, {session.user.name}</span>
            
            {/* Ubah tombol Logout menjadi form action */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" }); // Langsung arahkan ke halaman utama/katalog
              }}
            >
              <button
                type="submit"
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
              >
                Logout
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded text-xs font-semibold"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
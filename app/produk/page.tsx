import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/rupiah";

export default async function HalamanProduk() {
  // Mengambil SEMUA produk dari database
  const produkList = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Katalog Product</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {produkList.map((produk) => (
          <Link
            key={produk.slug}
            href={`/produk/${produk.slug}`}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:shadow-lg"
          >
            <div className="relative h-48 w-full bg-gray-100">
              {produk.imageUrl ? (
                <Image
                  src={produk.imageUrl}
                  alt={produk.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  Tanpa Gambar
                </div>
              )}
            </div>

            <div className="p-4">
              <h2 className="font-semibold text-gray-900">{produk.name}</h2>
              <p className="mt-1 text-lg font-bold text-blue-600">
                {formatRupiah(produk.price)}
              </p>
              <p className="mt-2 text-xs font-medium text-green-600">
                Stok: {produk.stock ?? 0}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
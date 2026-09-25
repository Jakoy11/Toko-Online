import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/rupiah";
import { bacaKeranjang } from "@/lib/cart";
import { ubahJumlah, hapusDariKeranjang } from "./action";

export default async function HalamanKeranjang() {
  const items = await bacaKeranjang();

  // Keranjang kosong
  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Keranjang kamu kosong</h1>
        <p className="mb-6 text-gray-600">
          Belum ada barang di sini. Yuk lihat-lihat produk dulu.
        </p>
        <Link
          href="/produk"
          className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Mulai belanja
        </Link>
      </main>
    );
  }

  // Ambil detail produk dari DB berdasarkan id di keranjang
  const ids = items.map((it) => it.productId);
  const produkList = await prisma.product.findMany({
    where: { id: { in: ids } },
  });

  // Gabungkan detail produk dengan quantity dari cookie
  const baris = items
    .map((it) => {
      const produk = produkList.find((p) => String(p.id) === String(it.productId));
      if (!produk) return null; // produk mungkin sudah dihapus admin
      return { produk, quantity: it.quantity };
    })
    .filter((b): b is { produk: typeof produkList[0]; quantity: number } => b !== null);

  const total = baris.reduce(
    (jml, b) => jml + b.produk.price * b.quantity,
    0
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Keranjang Belanja</h1>

      <div className="space-y-4">
        {baris.map((b) => (
          <div
            key={b.produk.id}
            className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
          >
            {/* PERBAIKAN DILAKUKAN DI SINI: Validasi imageUrl tidak kosong/null */}
            <div className="relative h-16 w-16 overflow-hidden rounded bg-gray-100 flex-shrink-0">
              {b.produk.imageUrl && b.produk.imageUrl.trim() !== "" ? (
                <Image
                  src={b.produk.imageUrl}
                  alt={b.produk.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-gray-400 text-center p-1">
                  Tanpa Gambar
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium">{b.produk.name}</p>
              <p className="text-sm text-gray-600">
                {formatRupiah(b.produk.price)} / item
              </p>
            </div>

            {/* Kontrol jumlah: tombol - dan + */}
            <div className="flex items-center gap-2">
              <form action={ubahJumlah.bind(null, b.produk.id, b.quantity - 1)}>
                <button
                  type="submit"
                  className="h-8 w-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold"
                >
                  −
                </button>
              </form>

              <span className="w-8 text-center">{b.quantity}</span>

              <form action={ubahJumlah.bind(null, b.produk.id, b.quantity + 1)}>
                <button
                  type="submit"
                  className="h-8 w-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </form>
            </div>

            {/* Subtotal per baris */}
            <div className="w-28 text-right font-medium">
              {formatRupiah(b.produk.price * b.quantity)}
            </div>

            {/* Tombol hapus */}
            <form action={hapusDariKeranjang.bind(null, b.produk.id)}>
              <button
                type="submit"
                className="text-sm text-red-600 hover:underline"
              >
                Hapus
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* Total keseluruhan */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <span className="text-lg font-bold">Total</span>
        <span className="text-lg font-bold">{formatRupiah(total)}</span>
      </div>

      <div className="mt-6 text-right">
        <Link
          href="/checkout"
          className="inline-block rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700"
        >
          Lanjut ke Checkout
        </Link>
      </div>
    </main>
  );
}
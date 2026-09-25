import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/rupiah";
import { hapusProduk } from "./action";

export default async function HalamanAdminProduk() {
  const produk = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kelola Produk</h1>
        <Link
          href="/admin/produk/baru"
          className="rounded bg-black px-4 py-2 text-white"
        >
          + Tambah Produk
        </Link>
      </div>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Gambar</th>
            <th className="py-2">Nama</th>
            <th className="py-2">Harga</th>
            <th className="py-2">Stok</th>
            <th className="py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {produk.map((p) => {
            const hapusDenganId = hapusProduk.bind(null, p.id);

            return (
              <tr key={p.id} className="border-b">
                <td className="py-2">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded bg-gray-200" />
                  )}
                </td>
                <td className="py-2">{p.name}</td>
                <td className="py-2">{formatRupiah(p.price)}</td>
                <td className="py-2">{p.stock}</td>
                <td className="py-2">
                  <Link
                    href={`/admin/produk/${p.id}/edit`}
                    className="mr-3 text-blue-600 underline"
                  >
                    Edit
                  </Link>
                  <form action={hapusDenganId} className="inline">
                    <button type="submit" className="text-red-600 underline">
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
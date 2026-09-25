import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ubahProduk } from "../../action";

export default async function HalamanEditProduk({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const produkId = Number(id);

  if (isNaN(produkId)) {
    notFound();
  }

  const produk = await prisma.product.findUnique({
    where: { id: produkId },
  });

  if (!produk) {
    notFound();
  }

  const ubahDenganId = ubahProduk.bind(null, produk.id);

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Produk</h1>

      {/* encType="multipart/form-data" wajib ada untuk upload file */}
      <form action={ubahDenganId} encType="multipart/form-data" className="space-y-4">
        <div>
          <label className="mb-1 block font-medium">Nama Produk</label>
          <input
            type="text"
            name="name"
            defaultValue={produk.name}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Harga (Rp)</label>
          <input
            type="number"
            name="price"
            defaultValue={produk.price}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Stok</label>
          <input
            type="number"
            name="stock"
            defaultValue={produk.stock}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Deskripsi</label>
          <textarea
            name="description"
            defaultValue={produk.description ?? ""}
            rows={4}
            required
            className="w-full rounded border p-2"
          />
        </div>

        {/* Input Gambar Produk */}
        <div>
          <label className="mb-1 block font-medium">Foto Produk</label>
          {produk.imageUrl && (
            <div className="mb-2">
              <p className="mb-1 text-xs text-gray-500">Foto saat ini:</p>
              <img
                src={produk.imageUrl}
                alt={produk.name}
                className="h-20 w-20 rounded object-cover border"
              />
            </div>
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full rounded border p-2"
          />
          <p className="mt-1 text-xs text-gray-500">
            Biarkan kosong jika tidak ingin mengubah foto.
          </p>
        </div>

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
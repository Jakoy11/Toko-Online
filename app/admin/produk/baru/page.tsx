import { buatProduk } from "../action";

export default function HalamanTambahProduk() {
  // Fungsi wrapper agar tidak return apa-apa (Promise<void>)
  async function handleSubmit(formData: FormData) {
    "use server";
    await buatProduk(formData);
  }

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold">Tambah Produk Baru</h1>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block font-medium">Nama Produk</label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Foto Produk</label>
          <input
          type="file"
          name="image"
          accept="image/*"
          className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Harga (Rp)</label>
          <input
            type="number"
            name="price"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Stok</label>
          <input
            type="number"
            name="stock"
            required
            className="w-full rounded border p-2"
          />
        </div>

        <div>
          <label className="mb-1 block font-medium">Deskripsi</label>
          <textarea
            name="description"
            rows={4}
            required
            className="w-full rounded border p-2"
          />
        </div>

        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Simpan Produk
        </button>
      </form>
    </div>
  );
}
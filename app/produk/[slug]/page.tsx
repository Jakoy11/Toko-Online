import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/rupiah";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { tambahKeranjang } from "@/app/keranjang/action";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Await params terlebih dahulu
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Cek jika slug tidak ada untuk mencegah error Prisma
  if (!slug) {
    notFound();
  }

  // Mencari 1 produk berdasarkan SLUG
  const produk = await prisma.product.findUnique({
    where: { slug: slug },
  });

  if (!produk) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/produk"
        className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-800"
      >
        &larr; Kembali ke katalog
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
          <img
            src={produk.imageUrl || "https://placehold.co/600x600?text=Produk"}
            alt={produk.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900">{produk.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-blue-600">
            {formatRupiah(produk.price)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Stok tersedia: {produk.stock ?? 0}
          </p>
          <p className="mt-6 leading-relaxed text-gray-700">
            {produk.description || "Tidak ada deskripsi."}
          </p>

          <form
            action={async () => {
              "use server";
              await tambahKeranjang(produk.id);
              redirect("/keranjang");
            }}
            className="mt-8"
          >
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Tambah ke keranjang
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
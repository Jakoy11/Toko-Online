import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bacaKeranjang } from "@/lib/cart";
import { formatRupiah } from "@/lib/rupiah";
import { buatPesanan } from "./actions";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const keranjang = await bacaKeranjang();
  if (!keranjang || keranjang.length === 0) {
    redirect("/produk");
  }

  const ids = keranjang.map((item) => item.productId);
  const produk = await prisma.product.findMany({
    where: { id: { in: ids } },
  });

  const baris = keranjang.map((item) => {
    const p = produk.find((x) => x.id === item.productId);
    const subtotal = (p?.price ?? 0) * item.quantity;
    return {
      nama: p?.name ?? "Produk",
      harga: p?.price ?? 0,
      quantity: item.quantity,
      subtotal,
    };
  });
  const total = baris.reduce((acc, b) => acc + b.subtotal, 0);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Ringkasan Pesanan</h1>

      <ul className="divide-y rounded-lg border">
        {baris.map((b, i) => (
          <li key={i} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{b.nama}</p>
              <p className="text-sm text-gray-500">
                {formatRupiah(b.harga)} x {b.quantity}
              </p>
            </div>
            <span className="font-semibold">{formatRupiah(b.subtotal)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatRupiah(total)}</span>
      </div>

      <form action={buatPesanan} className="mt-6">
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Buat Pesanan
        </button>
      </form>
    </main>
  );
}
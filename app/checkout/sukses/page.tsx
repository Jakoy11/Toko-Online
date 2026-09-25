import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/rupiah";

export default async function SuksesPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  if (!orderId) {
    notFound();
  }

  // Ambil pesanan beserta item-nya
  const order = await prisma.order.findUnique({
    where: { id: Number(orderId) },
    include: { items: true },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-2xl p-6 text-center">
      <div className="mb-4 text-5xl">✅</div>
      <h1 className="mb-2 text-2xl font-bold">Terima kasih!</h1>
      <p className="mb-1 text-gray-600">Pesananmu sudah kami terima.</p>
      <p className="mb-6 text-sm text-gray-500">
        Nomor pesanan: <span className="font-mono">{order.id}</span>
      </p>

      <ul className="mb-4 divide-y rounded-lg border text-left">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between p-4">
            <span>
              {formatRupiah(item.price)} × {item.quantity}
            </span>
            <span className="font-semibold">
              {formatRupiah(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mb-6 flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatRupiah(order.total)}</span>
      </div>

      <Link href="/produk" className="text-blue-600 hover:underline">
        Kembali belanja
      </Link>
    </main>
  );
}
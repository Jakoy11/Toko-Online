import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/rupiah";
import { redirect } from "next/navigation";

export default async function PesananPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: Number(session.user.id) },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  if (orders.length === 0) {
    return (
      <main className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Pesanan Saya</h1>
        <p className="text-gray-600">
          Kamu belum punya pesanan. Yuk mulai belanja!
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg p-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Pesanan #{order.id}</span>
              <span>{order.createdAt.toLocaleDateString("id-ID")}</span>
            </div>

            <ul className="divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between py-2">
                  <span>
                    {item.product.name} &times; {item.quantity}
                  </span>
                  <span>{formatRupiah(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Total</span>
              <span>{formatRupiah(order.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bacaKeranjang, simpanKeranjang } from "@/lib/cart";

export async function buatPesanan() {
  console.log("➡️ [1] 'buatPesanan' berhasil dipanggil!");

  // 1. Cek Auth
  const session = await auth();
  console.log("➡️ [2] Session User ID:", session?.user?.id);

  if (!session || !session.user?.id) {
    console.log("❌ User belum login, redirect ke /login");
    redirect("/login");
  }

  // 2. Baca Keranjang
  const keranjang = await bacaKeranjang();
  console.log("➡️ [3] Isu Keranjang:", keranjang);

  if (!keranjang || keranjang.length === 0) {
    console.log("❌ Keranjang kosong, redirect ke /produk");
    redirect("/produk");
  }

  // 3. Ambil Produk dari DB
  const ids = keranjang.map((item) => item.productId);
  const produk = await prisma.product.findMany({
    where: { id: { in: ids } },
  });

  // 4. Hitung Total & Validasi Stok
  const items = [];
  let total = 0;

  for (const item of keranjang) {
    const p = produk.find((x) => x.id === item.productId);
    if (!p) {
      console.log(`❌ Produk ID ${item.productId} tidak ditemukan di DB`);
      throw new Error("Produk tidak ditemukan.");
    }
    if (p.stock < item.quantity) {
      console.log(`❌ Stok ${p.name} tidak cukup. Stok: ${p.stock}, Minta: ${item.quantity}`);
      throw new Error(`Stok ${p.name} tidak mencukupi.`);
    }

    total += p.price * item.quantity;
    items.push({
      productId: p.id,
      quantity: item.quantity,
      price: p.price,
    });
  }

  // 5. Eksekusi Transaksi Database
  console.log("➡️ [4] Menyimpan ke Database...");
  const order = await prisma.$transaction(async (tx) => {
    const baru = await tx.order.create({
      data: {
        userId: Number(session.user.id),
        total,
        items: {
          create: items,
        },
      },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return baru;
  });

  console.log("✅ [5] Order Berhasil Dibuat dengan ID:", order.id);

  // 6. Kosongkan Keranjang
  await simpanKeranjang([]);

  // 7. Redirect ke Halaman Sukses
  redirect(`/checkout/sukses?order=${order.id}`);
}
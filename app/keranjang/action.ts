"use server"

import { revalidatePath } from "next/cache";
import { bacaKeranjang, simpanKeranjang } from "@/lib/cart";

//1. Tambah produk ke keranjang
export async function tambahKeranjang(productId: number | string) {
    const items = await bacaKeranjang();
    const adaItem = items.find((it) => String(it.productId) === String(productId));

    if (adaItem) {
        adaItem.quantity += 1;
    } else {
        items.push({ productId: Number(productId), quantity: 1});
    }

    await simpanKeranjang(items);
    revalidatePath("/keranjang");
    revalidatePath("/") // Update badge counter di navbar/layout
}

//2. Ubah Jumlah produk ( Tombol + / -)
export async function ubahJumlah(productId: number | string, jumlah: number ) {
    let items = await bacaKeranjang();

    if(jumlah <= 0) {
        items = items.filter((it) => String(it.productId) !== String(productId));
    } else {
        const adaItem = items.find((it) => String(it.productId) === String(productId));
        if (adaItem) {
            adaItem.quantity = jumlah;
        } else {
            items.push({ productId: Number(productId), quantity: jumlah });
        }
    }

    await simpanKeranjang(items);
    revalidatePath("/keranjang");
}

//3. Hapus produk dari keranjang
export async function hapusDariKeranjang(productId: number | string) {
    const items = await bacaKeranjang();

    // Filter item yang ID-nya tidak sama dengan productId
    const sisa = items.filter(
        (it) => String(it.productId) !== String(productId)
    );

    await simpanKeranjang(sisa);
    revalidatePath("/keranjang")
}
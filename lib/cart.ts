"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export type Item = {
    productId: number;
    quantity: number;
};

const NAMA_COOKIE = "keranjang";

export async function bacaKeranjang(): Promise<Item[]> {
    const jar = await cookies();
    const isi = jar.get(NAMA_COOKIE)?.value;

    if (!isi) {
        return [];
    }

    try {
        const data = JSON.parse(isi);
        if (!Array.isArray(data)) {
            return [];
        }
        return data;
    } catch {
        return [];
    }
}

export async function simpanKeranjang(items: Item[]): Promise<void> {
    const jar = await cookies();
    jar.set(NAMA_COOKIE, JSON.stringify(items), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 hari
    });
}
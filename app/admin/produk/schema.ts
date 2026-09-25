import { z } from "zod";

export const produkSchema = z.object({
    name: z.string().trim().min(1, "Nama produk wajib diisi" ),
    price: z.coerce
    .number()
    .int("Harga harus berupa angka bulat")
    .positive("Harga harus lebih dari 0"),
    stock: z.coerce
    .number()
    .int("Stock harus berupa angka bulat")
    .min(0, "Stok tidak boleh negatif"),
});
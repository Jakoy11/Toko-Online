import { z } from "zod";

export const daftarSchema = z.object({
    nama: z.string().trim().min(1, "Nama tidak boleh kosong"),
    email: z.string().trim().email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
});
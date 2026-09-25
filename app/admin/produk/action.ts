"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { simpanGambar } from "@/lib/upload";

// 1. Skema Validasi Produk
const produkSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  price: z.coerce.number().min(1, "Harga wajib diisi"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
});

// 2. Action Tambah Produk (Parameter dibuat simpel, cukup FormData)
export async function tambahProduk(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Kamu tidak punya izin untuk aksi ini" };
  }

  const data = {
    name: formData.get("name"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    description: formData.get("description"),
  };

  const hasil = produkSchema.safeParse(data);
  if (!hasil.success) {
    return { error: hasil.error.issues[0].message };
  }

  // 1. Tangkap file gambar dari FormData
  const fileGambar = formData.get("image") as File;

  // 2. Simpan gambar ke folder public/uploads
  const imageUrl = await simpanGambar(fileGambar);

  const { name, price, stock, description } = hasil.data;
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Date.now();

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        price,
        stock,
        description,
        imageUrl, // 3. Simpan URL hasil upload ke DB
      },
    });
  } catch (e) {
    console.error("Gagal menyimpan produk:", e);
    return { error: "Terjadi kesalahan. Coba lagi sebentar." };
  }

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

// 3. Action Ubah/Edit Produk (Menerima 'id' dari .bind())
export async function ubahProduk(id: number, formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Kamu tidak punya izin untuk aksi ini" };
  }

  const data = {
    name: formData.get("name"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    description: formData.get("description"),
  };

  const hasil = produkSchema.safeParse(data);
  if (!hasil.success) {
    return { error: hasil.error.issues[0].message };
  }

  const { name, price, stock, description } = hasil.data;

  // 1. Ambil file gambar dari formData jika ada
  const fileGambar = formData.get("image") as File | null;
  let imageUrl: string | null = null;

  if (fileGambar && fileGambar.size > 0) {
    imageUrl = await simpanGambar(fileGambar);
  }

  try {
    // 2. Siapkan data update
    const updateData: {
      name: string;
      price: number;
      stock: number;
      description: string;
      imageUrl?: string;
    } = {
      name,
      price,
      stock,
      description,
    };

    // Jika ada gambar baru yang diunggah, perbarui kolom imageUrl
    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: updateData,
    });
  } catch (e) {
    console.error("Gagal memperbarui produk:", e);
    return { error: "Terjadi kesalahan saat memperbarui produk." };
  }

  revalidatePath("/admin/produk");
  redirect("/admin/produk");
}

// 4. Action Hapus Produk (Menerima ID langsung)
export async function hapusProduk(id: number) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { error: "Kamu tidak punya izin untuk aksi ini" };
  }

  if (!id) {
    return { error: "ID Produk tidak ditemukan" };
  }

  try {
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
  } catch (e) {
    console.error("Gagal menghapus produk:", e);
    return { error: "Terjadi kesalahan saat menghapus produk." };
  }

  revalidatePath("/admin/produk");
  return { error: undefined };
}

// 5. Alias Export untuk Tambah Produk
export { tambahProduk as buatProduk };
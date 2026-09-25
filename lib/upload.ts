import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function simpanGambar(file: File): Promise<string | null> {
  // Kalau tidak ada file dipilih, kembalikan null (imageUrl kosong)
  if (!file || file.size === 0) {
    return null;
  }

  // Ubah file jadi data biner
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Bikin nama unik: waktu sekarang + nama asli (spasi dibuang)
  const namaUnik = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  // Tentukan path ke folder 'public/uploads'
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  // Otomatis buat folder 'uploads' jika belum ada di dalam folder 'public'
  await mkdir(uploadDir, { recursive: true });

  // Tentukan lokasi file lengkap yang akan disimpan
  const tujuan = path.join(uploadDir, namaUnik);
  await writeFile(tujuan, buffer);

  // URL yang bisa diakses browser (public/ tidak ikut ditulis di URL)
  return `/uploads/${namaUnik}`;
}
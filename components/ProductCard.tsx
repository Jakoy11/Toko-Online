import Link from "next/link";
import type { Product } from "@prisma/client";
import { formatRupiah } from "../lib/rupiah";

export default function ProductCard({ produk }: { produk : Product }) {
    return (
        <Link
        href={`/produk/${produk.slug}`}
        className="block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
        >
            {produk.imageUrl ? (
                <img
                src={produk.imageUrl}
                alt={produk.name}
                className="h-48-wfull object-cover"
                />
            ) : (
                <div className="flex h-48 w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                    Tanpa Gambar
                </div>
            )}

            <div className="p-4">
                 <h2 className="mb-1 font-semibold text-gray-900">{produk.name}</h2>
                 <p className="mb-2 text-lg font-bold text-blue-600">
                    {formatRupiah(produk.price)}
                 </p>
                 {produk.stock > 0 ? (
                    <span className="text-sm text-green-600">Stok: {produk.stock}</span>
                 ) : (
                    <span className="text-sm text-red-500">Habis</span>
                 )}
            </div>
        </Link>
    );
}
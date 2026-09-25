import {formatRupiah} from "../../lib/rupiah";
const harga = formatRupiah(150000);

export default function TentangPage() {
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold">Tentang Toko Online</h1>
            <p className="mt-4 text-gray-700">
                Toko Online 
            </p>
        </main>
    );
}
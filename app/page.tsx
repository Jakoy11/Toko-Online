import { prisma } from "../lib/prisma";
import ProductCard from "../components/ProductCard";
export default async function HomePage() {
  const produk = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className= "mb-6 text-3xl font-bold">Katalog Product</h1>

      {produk.length === 0 ? (
        <p className="text-gray-500">Belum ada produk yang tersedia.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {produk.map((item) => (
            <ProductCard key={item.id} produk={item} />
          ))}
        </div>
      )}
  </main>
  );
}
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


console.log("Seed dimulai: Memasukkan data produk...");

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    await prisma.product.createMany({
        data: [
            {
                name: "Kaos Polos Hitam",
                slug: "kaos-polos-hitam",
                price: 250000,
                stock: 20,
                description: "Kaos katun combed 30s, nyaman dipakai sehari-hari",
                imageUrl: null,
            },
            {
                name: "Topi Baseball Navy",
                slug: "topi-baseball-navy",
                price: 1000000,
                stock: 10,
                description: "Topi baseball berbahan kanvas dengan strap kebelakang.",
                imageUrl: null,
            },
            {
                name: "Knitwear Rajut",
                slug: "knitwear-rajut",
                price: 300000,
                stock: 20,
                description: "Knitwear Thanksinsomnia",
                imageUrl: null,
            },
            {
                name: "Sticker pack lucu",
                slug: "sticker-pack-lucu",
                price: 50000,
                stock: 50,
                description: "Isi 10 sticker vinyl tahan air, cocok untuk Laptop.",
                imageUrl: null,
            },
            {
                name: "Celana Baggy Jeans",
                slug: "celana-baggy-jeans",
                price: 400000,
                stock: 20,
                description: "Celana kalcer, cocok untuk diapakai sehari-hari.",
                imageUrl: null,
            },
        ],
        skipDuplicates: true,
    });

    console.log("Seed  selesai: Produk berhasil dimasukkan.");
}

main()
.then(() => prisma.$disconnect())
.catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { daftarSchema } from "./schema";

type FormState = { error?: string } | undefined;

export async function daftar(prevState: FormState, formData: FormData) {
    //1. Ambil data mentah dari form 
    const data = {
        nama: formData.get("nama"),
        email: formData.get("email"),
        password: formData.get("password"),
    };

    //2. Validasi dengan skema zod
    const hasil = daftarSchema.safeParse(data);
    if(!hasil.success) {
        // Ambil pesan error pertama yang relevan
        const pesan = hasil.error.issues[0].message;
        return { error: pesan};
    }

    //3. Sekarang data sudah pasti valid & rapi
    const { nama, email, password } = hasil.data;

    //4. Cek email belum terdaftar
    const sudahAda = await prisma.user.findUnique({ where: { email }});
    if (sudahAda) {
        return { error: "Email sudah terdaftar" };
    }

    //5. Hash password, lalu simpan
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
        data: { 
            name: nama,
            email,
            passwordHash,
        },
    });

    redirect("/login");
}
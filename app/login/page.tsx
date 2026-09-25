import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ error?: string; pesan?: string }>;
}) {
    const { error, pesan } = await searchParams;

    async function login(formData: FormData) {
        "use server";
        try {
            await signIn("credentials", {
                email: formData.get("email"),
                password: formData.get("password"),
                redirectTo: "/",
            });
        } catch (err) {
            if (err instanceof AuthError) {
                redirect("/login?error=Email%20atau%20password%20salah");
            }
            throw err;
        }
    }

    return (
        <main className="mx-auto max-w-sm px-4 py-10">
            <h1 className="mb-6 text-2xl font-bold">Masuk</h1>

            {pesan && (
                <p className="mb-4 rounded bg-green-100 px-3 py-2 text-sm text-green-700">
                    {pesan}
                </p>
            )}
            {error && (
                <p className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
                    {error}
                </p>
            )}

            <form action={login} className="flex flex-col gap-4">
                <div>
                    <label className="mb-1 block text-sm font-medium">Email</label>
                    <input
                    type="email"
                    name="email"
                    required
                    className="w-full rounded border px-3 py-2"
                    />
                </div>
                <div>
                    <label className="mb-1 bloct text-sm font-medium">Password</label>
                    <input
                    type="password"
                    name="password"
                    required
                    className="w-full rounded border px-3 py-2"
                    />
                </div>
                <button
                type="submit"
                className="rounded bg-black px-4 py-2 font-medium text-white"
                >
                    Masuk
                </button>
            </form>
            <p className="mt-4 text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link href="/daftar" className="underline">
                Daftar disini dul
                </Link>
            </p>
        </main>
    );
}
"use client";

import {useState} from "react";

export default function TombolHitung() {
    const [jumlah, setJumlah] = useState(0);

    return (
        <button
        onClick={() => setJumlah(jumlah+1)}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
            Diklik {jumlah} kali
            </button>
    );
}
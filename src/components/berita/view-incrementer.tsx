"use client"

import { useEffect, useRef } from "react";

interface ViewIncrementerProps {
    slug: string;
}

export function ViewIncrementer({ slug }: ViewIncrementerProps) {
    const sentRef = useRef(false);

    useEffect(() => {
        // Mencegah duplicate call di React 19 / development StrictMode
        if (sentRef.current) return;
        sentRef.current = true;

        fetch(`/api/berita/${slug}/views`, {
            method: "POST",
        }).catch((err) => {
            console.error("Gagal menambah view berita:", err);
        });
    }, [slug]);

    return null;
}
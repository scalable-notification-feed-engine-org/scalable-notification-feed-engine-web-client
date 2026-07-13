'use client';
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function PostModal({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") router.back();
        };
        document.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [router]);

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Create post"
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6"
        >
            <div
                onClick={() => router.back()}
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
                aria-hidden="true"
            />
            <div className="relative w-full max-w-lg bg-white rounded-2xl mt-16 sm:mt-0">
                <div className="flex items-center justify-end px-4 py-3 border-b border-border-subtle">
                    <div className=" w-[60%] flex justify-between items-center">
                    <h2 className="text-[19px] font-semibold text-center" style={{ fontFamily: "var(--font-display)" }}>
                        Create post
                    </h2>
                    <button
                        onClick={() => router.back()}
                        aria-label="Close"
                        className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full hover:bg-background text-muted transition-colors"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                 </div>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}
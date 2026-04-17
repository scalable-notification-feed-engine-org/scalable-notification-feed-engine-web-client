import { Navbar } from '@/components/ui/Navbar';
import React from "react";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="p-8">
                {children}
            </main>
        </div>
    );
}
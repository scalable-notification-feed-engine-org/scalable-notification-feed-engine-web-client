import Sidebar from "@/components/ui/Sidebar";
import React from "react";

export default function DashboardLayout({ children, modal }: { children: React.ReactNode, modal: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto flex">
                <Sidebar />
                <div className="flex-1 min-w-0">{children}</div>
            </div>
            {modal}
        </div>
    );
}
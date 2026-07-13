import { User } from "lucide-react";

export function AvatarFallback({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center bg-border-subtle text-muted ${className}`}>
            <User size="60%" aria-hidden="true" />
        </div>
    );
}

export function CoverFallback() {
    return <div className="w-full h-full bg-linear-to-b from-border-subtle/60 to-border-subtle" aria-hidden="true" />;
}
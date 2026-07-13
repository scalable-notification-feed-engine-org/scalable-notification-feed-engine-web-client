'use client';
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";

export default function PostComposerTrigger() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <button
            onClick={() => router.push("/dashboard/create-post")}
            className="w-full flex items-center gap-3 bg-card  rounded-saas p-3 mb-6 shadow-saas text-left hover:bg-background transition-colors"
        >
            <Avatar name={user?.firstName || "?"} />
            <span className="flex-1 text-sm text-muted">
        {user?.firstName ? `What's on your mind, ${user.firstName}?` : "What's on your mind?"}
      </span>
        </button>
    );
}
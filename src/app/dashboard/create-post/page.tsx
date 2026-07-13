'use client';
import { useRouter } from "next/navigation";
import { CreatePostBox } from "@/components/ui/CreatePostBox";
import { Post } from "@/types/post";

export default function CreatePostPage() {
    const router = useRouter();

    const handlePostCreated = (_newPost: Post) => {
        router.push("/dashboard");
        router.refresh();
    };

    return (
        <div className="max-w-lg mx-auto px-4 py-8">
            <h1 className="text-xl font-semibold text-foreground mb-4" style={{ fontFamily: "var(--font-display)" }}>
                Create post
            </h1>
            <CreatePostBox onPostCreated={handlePostCreated} />
        </div>
    );
}
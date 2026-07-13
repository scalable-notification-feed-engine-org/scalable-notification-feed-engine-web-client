'use client';
import { useRouter } from "next/navigation";
import PostModal from "@/components/ui/PostModal";
import { CreatePostBox } from "@/components/ui/CreatePostBox";
import { Post } from "@/types/post";

export default function CreatePostIntercepted() {
    const router = useRouter();

    const handlePostCreated = (_newPost: Post) => {
        router.refresh();
        router.back();
    };

    return (
        <PostModal>
            <CreatePostBox onPostCreated={handlePostCreated} />
        </PostModal>
    );
}
'use client';

import { useState } from 'react';
import { postService } from '@/api/post/post-service';
import { useAuth } from '@/context/AuthContext';
import { Send } from 'lucide-react';
import { Post } from "@/types/post";

interface CreatePostBoxProps {
    onPostCreated: (newPost: Post) => void;
}

export const CreatePostBox = ({ onPostCreated }: CreatePostBoxProps) => {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async () => {

        if (!content.trim() || !user?.id) {
            console.warn("User not authenticated or content is empty");
            return;
        }

        setIsSubmitting(true);
        try {

            const postData: Partial<Post> = {
                content: content.trim(),
                userId: user.id,
                tenantId: "default-tenant",
                createdAt: new Date().toISOString(),
                mediaUrls: [],
                likeCount: 0,
                commentCount: 0,
                isLiked: false,
                comments: []
            };

            const newPost = await postService.createPost(postData);


            onPostCreated(newPost);

            setContent("");
        } catch (error) {
            console.error("Post creation failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-card border border-border-subtle rounded-saas p-4 mb-6 shadow-saas transition-all focus-within:border-brand/40">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent border-none outline-none text-sm resize-none min-h-[80px] p-2 text-foreground placeholder:text-muted"
                disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-border-subtle">
                <span className="text-[10px] text-muted uppercase font-bold tracking-widest">
                    {user?.firstName ? `Posting as ${user.firstName}` : ""}
                </span>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !content.trim()}
                    className="bg-brand text-white px-5 py-2 rounded-md text-sm font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-lg shadow-brand/20"
                >
                    {isSubmitting ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <span>Post</span>
                            <Send size={14} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
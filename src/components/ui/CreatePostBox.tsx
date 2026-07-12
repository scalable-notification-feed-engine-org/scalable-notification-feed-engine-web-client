'use client';
import { useState } from 'react';
import { postService } from '@/api/post/post-service';
import { useAuth } from '@/context/AuthContext';
import { Send } from 'lucide-react';
import { Post } from "@/types/post";
import Avatar from "@/components/ui/Avatar";

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
                author: user,
                tenantId: "default-tenant",
                createdAt: new Date().toISOString(),
                mediaUrls: [],
                likeCount: 0,
                commentCount: 0,
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
        <div>
            <div className="flex items-center gap-3 px-1 pb-4 ">
                <Avatar name={user?.firstName || "?"} />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                        {user?.firstName || "You"}
                    </p>
                    <p className="text-xs text-muted">Posting to your feed</p>
                </div>
            </div>

            <label htmlFor="post-composer" className="sr-only">
                Create a post
            </label>
            <textarea
                id="post-composer"
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={user?.firstName ? `What's on your mind, ${user.firstName}?` : "What's on your mind?"}
                className="w-full bg-transparent border-none outline-none text-lg resize-none min-h-30 px-1 text-foreground placeholder:text-muted"
                disabled={isSubmitting}
            />

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-border-subtle px-1">
                <span className="text-xs text-muted">
                    {content.trim().length > 0 ? `${content.trim().length} characters` : ""}
                </span>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !content.trim()}
                    className="bg-blue-700 text-white px-6 h-10 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:active:scale-100 transition-all"
                >
                    {isSubmitting ? (
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-label="Posting" />
                    ) : (
                        <>
                            <span>Post</span>
                            <Send size={14} aria-hidden="true" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
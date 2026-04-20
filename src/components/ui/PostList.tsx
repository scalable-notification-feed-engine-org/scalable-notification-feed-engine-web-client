'use client';

import {useEffect, useState} from 'react';
import {Post, PostComment} from '@/types/post';
import { postService } from '@/api/post/post-service';
import { useAuth } from '@/context/AuthContext';
import {PostCard} from "@/components/ui/PostCard";

interface PostListProps {
    initialPosts: Post[];
}

export const PostList = ({ initialPosts }: PostListProps) => {
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const { user } = useAuth();

    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);



    const handleLikeToggle = async (postId: string) => {
        if (!user) return;

        const originalPosts = [...posts];

        setPosts(currentPosts =>
            currentPosts.map(post => {
                if (post.id === postId) {
                    const isLiked = !post.isLiked;
                    return {
                        ...post,
                        isLiked,
                        likeCount: isLiked ? (post.likeCount || 0) + 1 : Math.max(0, (post.likeCount || 0) - 1)
                    };
                }
                return post;
            })
        );

        try {
            await postService.toggleLike(postId, user.id);
        } catch (error) {
            console.error("Like failed, rolling back:", error);
            setPosts(originalPosts);
        }
    };


    const handleCommentAdded = (postId: string, newComment: PostComment) => {
        setPosts(currentPosts =>
            currentPosts.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        commentCount: (post.commentCount || 0) + 1,
                        comments: [...(post.comments || []), newComment],
                    };
                }
                return post;
            })
        );
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-6">
            <div className="space-y-2">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onLikeToggle={handleLikeToggle}
                        onCommentAdded={handleCommentAdded}
                    />
                ))}

                {posts.length === 0 && (
                    <p className="text-center text-muted py-10">No posts to show.</p>
                )}
            </div>
        </div>
    );
};
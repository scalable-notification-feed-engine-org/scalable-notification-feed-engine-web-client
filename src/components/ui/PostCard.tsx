import {Post, PostComment} from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import {MessageSquare, MoreHorizontal, Share2, Send, ThumbsUp} from "lucide-react";
import {useEffect, useState} from "react";
import { postService } from "@/api/post/post-service";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface PostCardProps {
    post: Post;
    onLikeToggle: (postId: string, currentIsLike:boolean) => void;
    onCommentAdded: (postId:string,data:PostComment) => void;
}

export const PostCard = ({ post, onLikeToggle, onCommentAdded}: PostCardProps) => {
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [isLiked, setIsLiked] = useState<boolean>(post.isLike);
    const [likeCount, setLikeCount] = useState<number>(post.likeCount);


    const { user } = useAuth();

    useEffect(() => {
        setIsLiked(post.isLike)
        setLikeCount(post.likeCount ?? 0)
    },[post.isLike, post.likeCount])

    const handleLikeClick = () => {
        const nextIsLike = !isLiked;
        setIsLiked(nextIsLike);
        setLikeCount(prevState => nextIsLike ? prevState + 1 : Math.max(0, prevState - 1));

        onLikeToggle(post.id, nextIsLike);
    }

    const handleAddComment = async () => {
        if (!commentText.trim() || isSubmitting) return;
        if (!user?.id) return;

        setIsSubmitting(true);
        try {
            const newComment: PostComment = await postService.addComment(
                post.id,
                user.id,
                commentText
            );

            onCommentAdded(post.id, newComment);
            setCommentText("");
        } catch (error) {
            console.error("Comment failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white border rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="flex items-center gap-3 p-4">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                    {post.author?.avatarUrl ? (
                        <Image
                            src={post.author.avatarUrl}
                            alt="avatar"
                            width={40}
                            height={40}
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-sm font-bold">
                            {post.author?.firstName?.substring(0, 2).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    <p className="text-sm font-semibold">
                        {post.author?.firstName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">
                        {post.createdAt
                            ? `${formatDistanceToNow(new Date(post.createdAt))} ago`
                            : "Just now"}
                    </p>
                </div>

                <MoreHorizontal size={18} className="text-gray-500" />
            </div>

            <div className="px-4 pb-3">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                    {post.content}
                </p>
            </div>

            {post.imageUrl && (
                <div className="w-full bg-[#d2b48c] flex justify-center">
                    <Image
                        src={post.imageUrl}
                        alt="post"
                        width={500}
                        height={600}
                        className="object-cover max-h-150 w-auto"
                    />
                </div>
            )}

            <div className="flex border-t text-sm">

                <button
                    onClick={handleLikeClick}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 ${
                        isLiked ? "text-blue-500" : "text-gray-600"
                    } hover:bg-gray-50`}
                >
                    <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} />
                    <span>Like</span>
                    <span className="text-xs text-gray-500">
            {likeCount ?? 0}

        </span>
                </button>

                <button
                    onClick={() => setShowCommentInput(!showCommentInput)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50"
                >
                    <MessageSquare size={16} />
                    <span>Comment</span>
                    <span className="text-xs text-gray-500">
            {post.commentCount ?? 0}
        </span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50">
                    <Share2 size={16} />
                    <span>Share</span>
                </button>

            </div>

            {showCommentInput && (
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex gap-2 mb-3">
                        <input
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleAddComment()
                            }
                            placeholder="Write a comment..."
                            className="flex-1 border rounded-full px-3 py-1 text-sm"
                        />
                        <button
                            onClick={handleAddComment}
                            className="bg-blue-500 text-white px-3 rounded-full text-sm"
                        >
                            <Send size={14} />
                        </button>
                    </div>

                    {post.comments?.map((c) => (
                        <div key={c.id} className="text-sm mb-2">
                            <span className="font-semibold">
                                User {c.userId.slice(0, 5)}
                            </span>{" "}
                            {c.content}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
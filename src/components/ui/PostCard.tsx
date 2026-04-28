import {Post, PostComment} from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageSquare, MoreHorizontal, Share2, Send } from "lucide-react";
import { useState } from "react";
import { postService } from "@/api/post/post-service";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface PostCardProps {
    post: Post;
    onLikeToggle: (postId: string) => void;
    onCommentAdded: (postId:string,data:PostComment) => void;
}

export const PostCard = ({ post, onLikeToggle, onCommentAdded }: PostCardProps) => {
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);

    const { user } = useAuth();

    const handleAddComment = async () => {
        if (!commentText.trim() || isSubmitting) return;

        if (!user?.id) {
            console.error("User identification failed");
            return;
        }

        setIsSubmitting(true);
        try {
            const newComment : PostComment = await postService.addComment(post.id, user.id, commentText);


            onCommentAdded(post.id,newComment);

            setCommentText("");
        } catch (error) {
            console.error("Comment failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-card border border-border-subtle rounded-saas shadow-saas p-5 mb-6 transition-all hover:border-brand/30">
            <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-brand/10 border border-brand/20 flex-shrink-0 flex items-center justify-center font-bold text-brand">
                    {post.author?.avatarUrl ? (
                        <Image src={post.author.avatarUrl} alt={post.author.firstName} className="w-full h-full object-cover" width="100" height="100"/>
                    ) : (
                        <div className="w-full h-full bg-brand/10 flex items-center justify-center font-bold text-brand">
                            {post.author?.firstName?.substring(0, 2).toUpperCase() || "??"}
                        </div>
                    )}
                </div>

                <div className="flex-1">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h4 className="font-semibold text-sm text-foreground">
                                {post.author?.firstName || `User ${post.author.id.split('-')[0]}`}
                            </h4>
                            <span className="text-muted text-[11px] font-medium tracking-tight">
    {post.createAt && !isNaN(new Date(post.createAt).getTime())
        ? `${formatDistanceToNow(new Date(post.createAt))} ago`
        : "Just now"}
</span>
                        </div>
                        <button className="text-muted hover:text-foreground transition-colors p-1 rounded-md">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>


                    <p className="text-foreground/90 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                        {post.content}
                    </p>


                    <div className="flex gap-4 border-t border-border-subtle pt-4 mt-2">
                        {/*<button*/}
                        {/*    onClick={() => onLikeToggle(post.id)}*/}
                        {/*    className={`flex items-center gap-2 transition-all text-xs font-semibold group/btn active:scale-95 ${post.isLiked ? 'text-red-500' : 'text-muted hover:text-brand'}`}*/}
                        {/*>*/}
                        {/*    /!*<div className={`p-1.5 rounded-md ${post.isLiked ? 'bg-red-50' : 'group-hover/btn:bg-brand/10'}`}>*!/*/}
                        {/*    /!*    <Heart size={16} fill={post.isLiked ? "currentColor" : "none"} />*!/*/}
                        {/*    /!*</div>*!/*/}
                        {/*    <span>{post.likeCount ?? 0} Likes</span>*/}
                        {/*</button>*/}

                        <button
                            onClick={() => setShowCommentInput(!showCommentInput)}
                            className="flex items-center gap-2 text-muted hover:text-brand transition-all text-xs font-semibold group/btn active:scale-95"
                        >
                            <div className="p-1.5 rounded-md group-hover/btn:bg-brand/10">
                                <MessageSquare size={16} />
                            </div>
                            <span>{post.commentCount ?? 0} Comments</span>
                        </button>

                        <button className="ml-auto p-1.5 text-muted hover:text-foreground transition-colors">
                            <Share2 size={16} />
                        </button>
                    </div>


                    {showCommentInput && (
                        <div className="mt-4 pt-4 border-t border-border-subtle animate-in fade-in duration-300">


                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                    placeholder="Add a comment..."
                                    disabled={isSubmitting}
                                    className="flex-1 bg-panel border border-border-subtle rounded-md px-3 py-1.5 text-xs outline-none focus:border-brand disabled:opacity-50"
                                />
                                <button
                                    onClick={handleAddComment}
                                    disabled={isSubmitting || !commentText.trim()}
                                    className="bg-brand text-white p-2 rounded-md hover:opacity-90 disabled:opacity-50 transition-all"
                                >
                                    <Send size={14} className={isSubmitting ? "animate-spin" : ""} />
                                </button>
                            </div>


                            <div className="space-y-3">
                                {post.comments && post.comments.length > 0 ? (
                                    post.comments.map((comment) => (
                                        <div key={comment.id} className="flex gap-3 group">

                                            <div className="h-7 w-7 rounded-full bg-panel border border-border-subtle flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-muted">
                                                {comment.userId.substring(0, 2).toUpperCase()}
                                            </div>

                                            <div className="flex-1 bg-panel/50 rounded-lg p-2 transition-colors group-hover:bg-panel">
                                                <div className="flex justify-between items-center mb-1">
                                <span className="text-[11px] font-bold text-brand">
                                    User {comment.userId.split('-')[0]}
                                </span>
                                                </div>
                                                <p className="text-xs text-foreground/80 leading-snug">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[11px] text-muted italic text-center py-2">
                                        No comments yet. Be the first to comment!
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    </div>
                    
                </div>
            </div>
    );
};
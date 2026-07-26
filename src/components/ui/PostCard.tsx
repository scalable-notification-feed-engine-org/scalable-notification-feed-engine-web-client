import {Post, PostComment} from "@/types/post";
import { formatDistanceToNow } from "date-fns";
import {MessageSquare, MoreHorizontal, Share2, Send, ThumbsUp, Smile, Camera, ImageIcon} from "lucide-react";
import {useState} from "react";
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
    const [commentCount, setCommentCount] = useState<number>(post.commentCount);
    const {user} = useAuth();

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
                user.firstName as string,
                commentText
            );
            setCommentCount(prevState => newComment ? prevState + 1 : Math.max(0, prevState - 1));
            onCommentAdded(post.id, newComment);
            setCommentText("");
        } catch (error) {
            console.error("Comment failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
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

                    <MoreHorizontal size={18} className="text-gray-500"/>
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
                        <ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"}/>
                        <span>Like</span>
                        <span className="text-xs text-gray-500">
            {likeCount ?? 0}

        </span>
                    </button>

                    <button
                        onClick={() => setShowCommentInput(!showCommentInput)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50"
                    >
                        <MessageSquare size={16}/>
                        <span>Comment</span>
                        <span className="text-xs text-gray-500">
            {commentCount ?? 0}
        </span>
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center gap-2 py-2 text-gray-600 hover:bg-gray-50">
                        <Share2 size={16}/>
                        <span>Share</span>
                    </button>

                </div>
                {showCommentInput && (
                    <div className="border-t">
                        <div className="px-4 pt-4 pb-2 space-y-4">
                            {post.comments && post.comments.length > 0 ? (
                                post.comments.map((c) => (
                                    <div key={c.id} className="flex gap-2">
                                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                            <div className="flex items-center justify-center h-full text-[10px] font-bold text-gray-600">
                                                {/* කමෙන්ට් එක දැමූ කෙනාගේ නමෙන් මුකුත් නැත්නම් 'U' පෙන්වන්න */}
                                                {c.author?.firstName?.substring(0, 2).toUpperCase() || "U"}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="inline-block bg-gray-100 rounded-2xl px-3 py-2">
                                                <p className="text-xs font-semibold text-gray-900">
                                                    {c.userName || user?.firstName || "User"}
                                                </p>

                                                <p className="text-sm text-gray-800">{c.content}</p>
                                            </div>

                                            <div className="flex items-center gap-3 mt-1 pl-3 text-xs text-gray-500 font-medium">
                                                <button className="hover:underline">Like</button>
                                                <button className="hover:underline">Reply</button>
                                                <span>
                                    {c.createdAt
                                        ? `${formatDistanceToNow(new Date(c.createdAt))} ago`
                                        : "Just now"}
                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-500 italic text-center py-2">
                                    No comments yet. Be the first to comment!
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 px-4 py-3 border-t bg-white">
                            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 shrink-0">
                                {user?.firstName ? (
                                    <></>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[10px] font-bold text-gray-600">
                                        {user?.firstName?.substring(0, 2).toUpperCase() || "ME"}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-1.5">
                                <input
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                                    placeholder="Write a comment..."
                                    className="flex-1 bg-transparent text-sm outline-none"
                                />
                                <div className="flex items-center gap-2 text-gray-500 pl-2">
                                    <Smile size={16} className="cursor-pointer hover:text-gray-700" />
                                    <Camera size={16} className="cursor-pointer hover:text-gray-700" />
                                    <ImageIcon size={16} className="cursor-pointer hover:text-gray-700" />
                                </div>
                            </div>

                            <button
                                onClick={handleAddComment}
                                disabled={isSubmitting || !commentText.trim()}
                                className="text-blue-500 disabled:opacity-40 p-1"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>

    );

}
export interface Post {
    id: string;
    content: string;
    userId: string;
    tenantId: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
    mediaUrls: string[];
    createdAt: string | Date;
    updatedAt: string | Date;
    comments: PostComment[];

    _count?: {
        likes: number;
        comments: number;
    };

    user?: {
        name: string;
        avatar?: string;
    };
}

export interface PostComment {
    id: string;
    content: string;
    userId: string;
}

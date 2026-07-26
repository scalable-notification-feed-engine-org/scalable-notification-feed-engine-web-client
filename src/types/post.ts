export interface User {
    id: string;
    firstName: string;
    email: string;
    avatarUrl?: string;
}

export interface PostComment {
    id: string;
    content: string;
    userId: string;
    createdAt?: string | Date;
    userName: string;
    author?: User
}

export interface Post {
    id: string;
    content: string;
    tenantId: string;
    mediaUrls?: string[];
    isLike:boolean;
    userName:string;
    createdAt: string | Date;
    likeCount: number;
    commentCount: number;
    author: User;
    comments?: PostComment[];
}
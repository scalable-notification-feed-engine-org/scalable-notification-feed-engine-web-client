export interface User {
    id: string;
    firstName: string;
    email?: string;
    avatarUrl: string;
}

export interface PostComment {
    id: string;
    content: string;
    userId: string;
}

export interface Post {
    id: string;
    content: string;
    mediaUrls: string[];
    createAt: string | Date;
    likeCount: number;
    commentCount: number;
    author: User;
    comments?: PostComment[];
}
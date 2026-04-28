export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Post {
    id: string;
    content: string;
    author: User;
}
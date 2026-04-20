'use client';

import { useState, useEffect } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from "@/context/AuthContext";
import { Post } from "@/types/post";
import { postService } from "@/api/post/post-service";
import { PostList } from "@/components/ui/PostList";
import { CreatePostBox } from "@/components/ui/CreatePostBox"; // 👈 මෙය Import කරන්න

export interface User {
    id: string;
    firstName: string;
}

export default function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isPostsLoading, setIsPostsLoading] = useState(true);

    const { status } = useNotifications();
    const { token, user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const tokenValue = typeof token === 'function' ? token() : token;
            if (!tokenValue) return;

            try {
                // 1. Fetch Users
                const userRes = await fetch('http://localhost:9090/api/v1/users/get-all-user-details', {
                    headers: { 'Authorization': `Bearer ${tokenValue}` }
                });
                const userData = await userRes.json();
                setUsers(Array.isArray(userData.data) ? userData.data : []);

                // 2. Fetch Posts
                if (user?.id) {
                    const postsData = await postService.getPosts(user.id);
                    console.log("Fetch all post data" , postsData);
                    setPosts(postsData);
                }
            } catch (err) {
                console.error("Dashboard data fetch error:", err);
            } finally {
                setIsPostsLoading(false);
            }
        };

        fetchData();
    }, [token, user?.id]);


    const handlePostCreated = (newPost: Post) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">

            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-6">Activity Feed 🚀</h1>


                <CreatePostBox onPostCreated={handlePostCreated} />

                {isPostsLoading ? (
                    <div className="text-center py-10 italic text-muted">Loading posts...</div>
                ) : (
                    <PostList initialPosts={posts} />
                )}
            </div>


            <div className="w-full md:w-80 shrink-0">
                <div className="sticky top-6">
                    <h2 className="text-lg font-bold mb-4 italic">Active Members 🖥️</h2>
                    <div className="grid gap-3">
                        {users.map((u) => {
                            const userStatus = (status as Record<string, string>)[u.id] || 'offline';
                            return (
                                <div key={u.id}
                                     className="p-3 border border-border-subtle rounded-lg flex items-center justify-between bg-card shadow-sm">
                                    <span className="text-sm font-medium">{u.firstName}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${userStatus === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                                            {userStatus}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {users.length === 0 && <p className="text-xs text-muted italic">No users found.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
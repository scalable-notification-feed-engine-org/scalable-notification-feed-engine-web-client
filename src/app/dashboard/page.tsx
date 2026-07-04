'use client';

import {useEffect, useState} from 'react';
import {useNotifications} from '@/context/NotificationContext';
import {useAuth} from "@/context/AuthContext";
import {useTenantStore} from "@/store/useTenantStore"; 
import {Post} from "@/types/post";
import {PostList} from "@/components/ui/PostList";
import {CreatePostBox} from "@/components/ui/CreatePostBox";
import {useQuery} from "@apollo/client/react";
import {GET_FEED} from "@/lib/graphql/queries";



export interface User {
    id: string;
    firstName: string;
}
interface GetFeedData {
    getFeed: Post[];
}

export default function Dashboard() {
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isPostsLoading, setIsPostsLoading] = useState(true);
    const { activeTenant } = useTenantStore(); 
    const { status } = useNotifications();
    const { token, user } = useAuth();

    const {data} = useQuery<GetFeedData>(GET_FEED, {
        fetchPolicy: 'network-only',
        context: {
            headers: {
                "X-Tenant-ID": activeTenant?.id 
            }
        },
        skip: !activeTenant 
    });
    useEffect(() => {
        const fetchData = async () => {
            const tokenValue = typeof token === 'function' ? token() : token;
          
            if (!tokenValue || !activeTenant) return;

            try {
                
                const userRes = await fetch('http://localhost:9090/api/v1/users/get-all-user-details', {
                    headers: {
                        'Authorization': `Bearer ${tokenValue}`,
                        'X-Tenant-ID': activeTenant.id
                    }
                });
                const userData = await userRes.json();
                setUsers(Array.isArray(userData.data) ? userData.data : []);

            } catch (err) {
                console.error("Dashboard data fetch error:", err);
            } finally {
                setIsPostsLoading(false);
            }
        };

        fetchData();
    }, [token, user?.id, activeTenant, data]);


    const handlePostCreated = (newPost: Post) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 flex flex-col md:flex-row gap-8">

            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-6">
                    {activeTenant ? `${activeTenant.name} Feed` : 'Activity Feed'}
                </h1>

                {activeTenant ? (
                    <>
                        <CreatePostBox onPostCreated={handlePostCreated} />
                        {isPostsLoading ? (
                            <div className="text-center py-10 italic text-muted">Loading posts...</div>
                        ) : (
                            <PostList initialPosts={data?.getFeed || []} />
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-xl">
                        <p className="text-muted italic">Please select a group to view the feed.</p>
                    </div>
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
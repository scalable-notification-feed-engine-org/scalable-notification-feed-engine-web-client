'use client';

import { useEffect, useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from "@/context/AuthContext";
import { useTenantStore } from "@/store/useTenantStore";
import { Post } from "@/types/post";
import { PostList } from "@/components/ui/PostList";
import { useQuery } from "@apollo/client/react";
import { GET_FEED } from "@/lib/graphql/queries";
import FeedSkeleton from "@/components/ui/FeedSkeleton";
import PostComposerTrigger from "@/components/ui/PostComposerTrigger";

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

    const { data } = useQuery<GetFeedData>(GET_FEED, {
        fetchPolicy: 'network-only',
        context: {
            headers: {
                "X-Tenant-ID": activeTenant?.id,
                'x-user-id': user?.id || '',
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
    }, [token, user?.id, activeTenant]);

    return (

        <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-6 py-6">
            <div className="flex-1 justify-center items-center min-w-0">
                <div className="flex flex-col items-center justify-center">
                {activeTenant ? (
                    <>
                        <PostComposerTrigger />
                        {isPostsLoading ? (
                            <FeedSkeleton />
                        ) : (
                            <PostList initialPosts={data?.getFeed || []} />
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-border-subtle rounded-saas">
                        <p className="text-muted">Select a group to view its feed.</p>
                    </div>
                )}
                </div>
            </div>

        </div>
    );
}
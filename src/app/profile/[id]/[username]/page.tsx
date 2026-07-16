'use client';

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProfileHeader from "@/components/ui/ProfileHeader";
import ProfileTabs from "@/components/ui/ProfileTabs";
import AboutSection from "@/components/ui/about/AboutSection";
import SuggestedPeople from "@/components/ui/SuggestedPeople";
import { ProfileData } from "@/types/profile";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";

export default function ProfilePage() {
    const { token, user } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [activeTab, setActiveTab] = useState("About");
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const currentToken = typeof token === 'function' ? token() : token;
    const userId = user?.id;
    const targetId = Array.isArray(params.id) ? params.id[0] : (params.id ?? userId);
    const targetUserName = Array.isArray(params.username) ? params.username[1] : (params.username ?? "Default");

    const fetchProfile = useCallback(async () => {
        if (!currentToken || !targetId) {
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:9090/api/v1/profiles/${targetId}`, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'X-User-Id': userId,
                    'X-Tenant-Id': "000000000000000000000000000000000000000000"
                }
            });
            setProfile(response.data);

        } catch (err) {
            console.warn("Profile not found in DB, fallback to generating client-side default profile UI.");
            if (targetId === userId) {
                const defaultProfile: ProfileData = {
                    followersCount: 0,
                    followingCount: 0,
                    ownProfile: true,
                    id: userId,
                    name: `${user?.firstName || ''} ${user?.firstName || ''}`.trim() || "New User",
                    aliasName: user?.firstName || "",
                    bioLines: ["Welcome to your new profile! Click edit to add a bio."],
                    category: "Member",
                    location: "Not Specified",
                    avatarImageKey: profile?.avatarImageKey,
                    coverImageKey: profile?.coverImageKey,
                    suggestedPeople: [],
                    currentUserId: userId
                };
                setProfile(defaultProfile);
            } else {
                const defaultProfile: ProfileData = {
                    followersCount: 0,
                    followingCount: 0,
                    ownProfile: false,
                    id: targetId,
                    name: `${targetUserName || ''} ${targetUserName || ''}`.trim() || "New User",
                    aliasName: targetUserName || "",
                    bioLines: ["Welcome to your new profile! Click edit to add a bio."],
                    category: "Member",
                    location: "Not Specified",
                    avatarImageKey: null,
                    coverImageKey: null,
                    suggestedPeople: [],
                    currentUserId: userId
                };

                setProfile(defaultProfile);
            }
        } finally {
            setIsLoading(false);
        }
    }, [currentToken, targetId, userId, user?.firstName, profile?.avatarImageKey, profile?.coverImageKey, targetUserName]);

    const handleProfileUpdate = async (updatedData: Partial<ProfileData>) => {
        if (!currentToken || !userId) return;
        const isBlobAvatar = updatedData.avatarImageKey?.startsWith('blob:');
        const isBlobCover = updatedData.coverImageKey?.startsWith('blob:');

        if (isBlobAvatar || isBlobCover) {
            setProfile(prev => {
                if (!prev) return null;
                return {
                    ...prev,
                    ...updatedData
                };
            });
            return;
        }

        const nameToSubmit = updatedData.name || user?.firstName || profile?.name;
        if (!nameToSubmit?.trim()) {
            alert("Name cannot be empty");
            return;
        }

        const payload = {
            name: nameToSubmit,
            aliasName: updatedData.aliasName || profile?.aliasName || "",
            bioLines: Array.isArray(updatedData.bioLines) ? updatedData.bioLines : (profile?.bioLines || []),
            category: updatedData.category || profile?.category || "",
            location: updatedData.location || profile?.location || "",
            avatarImageKey: updatedData.avatarImageKey !== undefined ? updatedData.avatarImageKey : profile?.avatarImageKey,
            coverImageKey: updatedData.coverImageKey !== undefined ? updatedData.coverImageKey : profile?.coverImageKey
        };

        try {
            await axios.put('http://localhost:9090/api/v1/profiles/me', payload, {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json',
                    'X-User-Id': userId,
                    'X-Tenant-Id': "00000000000000000000000000000000000000000000000000"
                }
            });

            await fetchProfile();
        } catch (err) {
            console.error("Failed to update profile on backend:", err);
            alert("Failed to save profile on server. Please check backend logs.");
        }
    };

    useEffect(() => {
        if (currentToken && targetId) {
            fetchProfile();
        } else {
            setIsLoading(false);
        }
    }, [currentToken, targetId, fetchProfile]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand" />
            </div>
        );
    }

    if (!currentToken || !userId) {
        return (
            <div className="text-center py-16 text-sm text-muted">
                Please log in to view your profile.
            </div>
        );
    }

    return (
        <div>
            <ProfileHeader
                profile={profile}
                accessToken={currentToken}
                onProfileUpdate={handleProfileUpdate}
            />

            <ProfileTabs active={activeTab} onChange={setActiveTab} />

            {activeTab === "About" && <AboutSection profile={profile} />}

            {activeTab === "All" && (
                <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                    {profile?.suggestedPeople && profile.suggestedPeople.length > 0 && (
                        <SuggestedPeople people={profile.suggestedPeople} />
                    )}
                    <div className="text-center py-16 text-sm text-muted">Feed eka methanata enawa.</div>
                </div>
            )}

            {!["About", "All"].includes(activeTab) && (
                <div className="max-w-5xl mx-auto px-4 py-16 text-center text-sm text-muted">
                    {activeTab} — coming soon.
                </div>
            )}
        </div>
    );
}
'use client';

import React, {useState, useRef, useEffect} from "react";
import { ProfileData } from "@/types/profile";
import { Loader2, MessageCircle, UserPlus, Search, Pencil, Plus, ImagePlus } from "lucide-react";
import { useProfileUpload } from "@/hooks/user-profile-upload";
import Image from "next/image";
import Button from "@/components/ui/Button";
import {useAuth} from "@/context/AuthContext";
import axios from "axios";

interface ProfileHeaderProps {
    profile: ProfileData | null;
    accessToken: string;
    onProfileUpdate: (updatedData: Partial<ProfileData>) => Promise<void>;
}

export default function ProfileHeader({ profile, accessToken, onProfileUpdate }: ProfileHeaderProps) {
    const {
        aliasName = "",
        isVerified = false,
        coverImageUrl,
        avatarImageUrl,
        ownProfile = true
    } = profile || {};


    const { uploadProfileImage, isUploading } = useProfileUpload(accessToken);
    const [activeUploadType, setActiveUploadType] = useState<'avatar' | 'cover' | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const {user, token} = useAuth();
    const currentToken = typeof token === 'function' ? token() : token;
    const[isFollowing,setIsFollowing] = useState<boolean>(false);

    useEffect(() => {
        if (profile?.id && currentToken) {
            console.log("HELLO USE EFFECT")
            axios.get(`http://localhost:9090/api/v1/follows/check/${profile.id}`, {

                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'X-User-Id': user?.id
                }
            })
                .then(res => {
                    console.log("MESSAGE", res.data)
                    setIsFollowing(res.data)

                })
                .catch(err => {
                    console.error("Check status failed:", err);
                })

        }
    }, [profile?.id, currentToken, user?.id]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (user?.id != profile?.currentUserId){
            if (profile) {
                profile.ownProfile = false;
            }
        }

        const localPreviewUrl = URL.createObjectURL(file);
        setActiveUploadType(type);

        await onProfileUpdate({ [`${type}ImageUrl`]: localPreviewUrl });

        try {
            const uploadedKey = await uploadProfileImage(file, type)

            if (uploadedKey) {
                await onProfileUpdate({ [`${type}ImageKey`]: uploadedKey });
            } else {
                alert(`Could not save image to cloud storage.`);
            }
        } catch (err) {
            console.error(`${type} upload lifecycle failed:`, err);
        } finally {
            setActiveUploadType(null);
        }
    };

    const handleMessage = () => {
        console.log("Message clicked");
    };

    const handleFollow = async (followeeId: string) => {
        if (!profile?.id) return;

        const previousState = isFollowing;
        const nextState = !isFollowing;

        setIsFollowing(nextState);

        try {
            const endpoint = previousState
                ? `http://localhost:9090/api/v1/follows/unfollow/${followeeId}`
                : `http://localhost:9090/api/v1/follows/follow/${followeeId}`;

            await axios.post(endpoint, {}, {
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'X-User-Id': user?.id
                }
            });

        } catch (error) {
            console.error("Follow action failed:", error);
            setIsFollowing(previousState);
        }
    };

    const handleSearch = () => {
        console.log("Search clicked");
    };

    return (
        <div className="relative w-full bg-background border-b">
            <div className="relative h-60 w-full bg-muted flex items-center justify-center overflow-hidden">
                {coverImageUrl ? (
                    <Image src={coverImageUrl} alt="Cover" width={1200} height={400} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-muted-foreground text-sm">No cover image added</div>
                )}

                {profile?.ownProfile && (
                    coverImageUrl ? (
                        <button
                            onClick={() => coverInputRef.current?.click()}
                            className="absolute bottom-4 right-4 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-md flex items-center gap-2 text-xs font-medium backdrop-blur-sm transition z-10"
                        >
                            <Pencil className="w-4 h-4" /> Edit Cover
                        </button>
                    ) : (
                        <button
                            onClick={() => coverInputRef.current?.click()}
                            className="absolute bottom-4 right-4 bg-background/80 hover:bg-background border text-foreground p-2 rounded-full shadow-md flex items-center gap-2 text-xs font-medium backdrop-blur-sm transition z-10"
                        >
                            <ImagePlus className="w-4 h-4" />  Add Cover Photo
                        </button>
                    )
                )}
                <input type="file" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'cover')} className="hidden" accept="image/*" />

                {isUploading && activeUploadType === 'cover' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                )}
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
                <div className="relative w-35 h-35 rounded-full border-4 border-blue-700 p-1 bg-muted flex items-center justify-center overflow-hidden shadow-lg group">
                    {avatarImageUrl ? (
                        <Image src={avatarImageUrl} width={200} height={200} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <div className="text-xl font-bold uppercase text-muted-foreground">{profile?.aliasName?.substring(0, 2)}</div>
                    )}

                    {isUploading && activeUploadType === 'avatar' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                        </div>
                    )}
                </div>

                {ownProfile && (
                    <button
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute left-30 sm:left-28 bottom-19 sm:bottom-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md flex items-center justify-center transition z-10"
                        aria-label={avatarImageUrl ? "Edit profile photo" : "Add profile photo"}
                    >
                        {avatarImageUrl ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </button>
                )}
                <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" accept="image/*" />

                <div className="text-center sm:text-left mb-2 flex-1">
                    <h1 className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2">
                        {profile?.aliasName} {isVerified && <span className="text-blue-500 text-sm">✓</span>}
                    </h1>
                    {aliasName && <p className="text-sm text-muted-foreground">@{aliasName}</p>}
                </div>

                {!ownProfile ? (
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            label="Message"
                            icon={<MessageCircle className="w-4 h-4" />}
                            variant="primary"
                            fullWidth={false}
                            onClick={handleMessage}
                            className="h-10 px-4 text-sm"
                            ariaLabel="Send message"
                        />
                        <Button
                            label={isFollowing ? "Unfollow" : "Follow"}
                            icon={<UserPlus className="w-4 h-4" />}
                            variant="primary"
                            fullWidth={false}
                            onClick={() => profile?.id && handleFollow(profile.id)}
                            className="h-10 px-4 text-sm"
                            ariaLabel={isFollowing ? "Unfollow user" : "Follow user"}
                        />
                        <Button
                            label="Search"
                            icon={<Search className="w-4 h-4" />}
                            variant="secondary"
                            fullWidth={false}
                            onClick={handleSearch}
                            className="h-10 px-4 text-sm"
                            ariaLabel="Search"
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-2 mb-2">
                        <Button
                            label="Add to story"
                            icon={<Plus className="w-4 h-4" />}
                            variant="primary"
                            fullWidth={false}
                            onClick={handleMessage}
                            className="h-10 px-4 text-sm"
                            ariaLabel="Add to story"
                        />
                        <Button
                            label="Edit profile"
                            icon={<Pencil className="w-4 h-4 text-black" />}
                            variant="secondary"
                            fullWidth={false}
                            className="h-11 text-sm border border-gray-400 bg-gray-400"
                            ariaLabel="Edit profile"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
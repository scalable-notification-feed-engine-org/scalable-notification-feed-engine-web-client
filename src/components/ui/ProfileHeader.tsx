'use client';

import React, { useState, useRef } from "react";
import { ProfileData } from "@/types/profile";
import { Loader2, Camera } from "lucide-react";
import { useProfileUpload } from "@/hooks/user-profile-upload";
import Image from "next/image";

interface ProfileHeaderProps {
    profile: ProfileData | null;
    accessToken: string;
    onProfileUpdate: (updatedData: Partial<ProfileData>) => Promise<void>;
}

export default function ProfileHeader({ profile, accessToken, onProfileUpdate }: ProfileHeaderProps) {
    const {
        name = "New User",
        aliasName = "",
        isVerified = false,
        coverImageUrl,
        avatarImageUrl,
        isOwnProfile = true
    } = profile || {};

    const { uploadProfileImage, isUploading } = useProfileUpload(accessToken);
    const [activeUploadType, setActiveUploadType] = useState<'avatar' | 'cover' | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
        const file = e.target.files?.[0];
        if (!file) return;


        const localPreviewUrl = URL.createObjectURL(file);
        setActiveUploadType(type);

        await onProfileUpdate({ [`${type}ImageUrl`]: localPreviewUrl });

        try {
            const uploadedKey = await uploadProfileImage(file, type);

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

    return (
        <div className="relative w-full bg-background border-b">
            <div className="relative h-60 w-full bg-muted flex items-center justify-center overflow-hidden">
                {coverImageUrl ? (
                    <Image src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-muted-foreground text-sm">No cover image added</div>
                )}
                {isOwnProfile && (
                    <button
                        onClick={() => coverInputRef.current?.click()}
                        className="absolute bottom-4 right-4 bg-background/80 hover:bg-background text-foreground p-2 rounded-full shadow-md flex items-center gap-2 text-xs font-medium backdrop-blur-sm transition z-10"
                    >
                        <Camera className="w-4 h-4" /> Change Cover
                    </button>
                )}
                <input type="file" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'cover')} className="hidden" accept="image/*" />

                {isUploading && activeUploadType === 'cover' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                )}
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-6 relative flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
                <div className="relative w-32 h-32 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-lg group">
                    {avatarImageUrl ? (
                        <Image src={avatarImageUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-xl font-bold uppercase text-muted-foreground">{name?.substring(0, 2)}</div>
                    )}
                    {isOwnProfile && (
                        <button
                            onClick={() => avatarInputRef.current?.click()}
                            className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 z-10"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    )}
                    <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden" accept="image/*" />

                    {isUploading && activeUploadType === 'avatar' && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                        </div>
                    )}
                </div>

                <div className="text-center sm:text-left mb-2 flex-1">
                    <h1 className="text-2xl font-bold flex items-center justify-center sm:justify-start gap-2">
                        {name} {isVerified && <span className="text-blue-500 text-sm">✓</span>}
                    </h1>
                    {aliasName && <p className="text-sm text-muted-foreground">@{aliasName}</p>}
                </div>
            </div>
        </div>
    );
}
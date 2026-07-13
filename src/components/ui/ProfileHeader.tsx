'use client';
import Image from "next/image";
import { Camera, Plus, Pencil, UserPlus, BadgeCheck } from "lucide-react";
import { ProfileData } from "@/types/profile";
import Button from "@/components/ui/Button";
import { AvatarFallback, CoverFallback } from "@/components/ui/AvatarPlaceholder";

interface ProfileHeaderProps {
    profile: ProfileData;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    const { name, aliasName, isVerified, coverImageUrl, avatarImageUrl, isOwnProfile } = profile;

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto">
                <div className="relative w-full h-40 sm:h-56 md:h-72 overflow-hidden sm:rounded-b-saas">
                    {coverImageUrl ? (
                        <Image
                            src={coverImageUrl}
                            alt={`${name}'s cover photo`}
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 1024px"
                            className="object-cover"
                        />
                    ) : (
                        <CoverFallback />
                    )}

                    {isOwnProfile && (
                        <button className="absolute bottom-3 right-3 flex items-center gap-2 h-9 px-3 rounded-md bg-white/95 hover:bg-white text-sm font-semibold text-foreground shadow-saas transition-colors">
                            <Camera size={16} aria-hidden="true" />
                            {coverImageUrl ? "Edit cover photo" : "Add cover photo"}
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14">
                    <div className="flex items-end gap-4">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-white border-2 border-brand overflow-hidden shrink-0">
                            {avatarImageUrl ? (
                                <Image
                                    src={avatarImageUrl}
                                    alt={`${name}'s profile picture`}
                                    fill
                                    sizes="128px"
                                    className="object-cover"
                                />
                            ) : (
                                <AvatarFallback className="w-full h-full" />
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:pb-1">
                        {isOwnProfile ? (
                            <>
                                <Button
                                    label="Add to story"
                                    icon={<Plus size={16} aria-hidden="true" />}
                                    variant="primary"
                                    fullWidth={false}
                                    className="h-9 px-4 text-sm"
                                />
                                <Button
                                    label="Edit profile"
                                    icon={<Pencil size={16} aria-hidden="true" />}
                                    variant="secondary"
                                    fullWidth={false}
                                    className="h-9 px-4 text-sm"
                                />
                            </>
                        ) : (
                            <Button
                                label="Follow"
                                icon={<UserPlus size={16} aria-hidden="true" />}
                                variant="primary"
                                fullWidth={false}
                                className="h-9 px-4 text-sm"
                            />
                        )}
                    </div>
                </div>

                <div className="mt-3 sm:mt-2 pb-6">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <h1 className="text-xl sm:text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                            {name}
                        </h1>
                        {isVerified && (
                            <BadgeCheck size={20} className="text-brand fill-brand/20" aria-label="Verified account" />
                        )}
                        {aliasName && <span className="text-lg sm:text-xl font-medium text-muted">({aliasName})</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}
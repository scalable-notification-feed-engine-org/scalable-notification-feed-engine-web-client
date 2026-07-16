export interface AboutDetails {
    bioLines?: [string];
    pinnedDetails?: string[];
    currentCity?: string;
    homeTown?: string;
    birthDate?: string;
    birthYear?: string;
    relationshipStatus?: string;
    familyMembers?: string[];
    gender?: string;
    pronouns?: string;
    languages?: string[];
}

export interface SuggestedPerson {
    id: string;
    name: string;
    mutualFriendsCount?: number;
    avatarUrl?: string;
}

export interface ProfileData extends AboutDetails{
    id: string;
    name: string;
    aliasName?: string;
    isVerified?: boolean;
    avatarImageUrl?: string;
    coverImageUrl?: string;
    avatarImageKey?: string | null;
    coverImageKey?: string | null;
    currentUserId: string | undefined;
    followersCount: number;
    followingCount: number;
    category?: string;
    location?: string;
    ownProfile: boolean;
    about?: AboutDetails;
    suggestedPeople?: SuggestedPerson[];
}
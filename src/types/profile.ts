export interface AboutDetails {
    bio?: string;
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

export interface ProfileData {
    id: string;
    name: string;
    aliasName?: string;
    isVerified?: boolean;
    coverImageUrl?: string;
    avatarImageUrl?: string;
    followersCount: number;
    followingCount: number;
    category?: string;
    location?: string;
    isOwnProfile: boolean;
    about: AboutDetails;
    suggestedPeople?: SuggestedPerson[];
}
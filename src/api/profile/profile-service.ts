import apiClient from "@/lib/api-client";

export interface PersonalDetailField {
    field: string;
    value: string;
    audience?: "public" | "friends" | "only-me";
}

export const profileService = {
    updatePersonalDetail: async ({ field, value, audience }: PersonalDetailField) => {
        const response = await apiClient.patch(`/users/profile/personal-details`, {
            field,
            value,
            audience,
        });
        return response.data.data;
    },
};
'use client';

import { useState } from "react";
import axios from "axios";
import {useAuth} from "@/context/AuthContext";

export const useProfileUpload = (accessToken: string) => {
    const [isUploading, setIsUploading] = useState(false);
    const {user} = useAuth();

    const uploadProfileImage = async (file: File, type: 'avatar' | 'cover'): Promise<string | null> => {
        setIsUploading(true);
        try {
            const response = await axios.post(
                `http://localhost:9090/api/v1/profiles/media/presigned-url`,
                {
                    imageType: type.toUpperCase(),
                    contentType: file.type
                },
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                        'X-User-Id': user?.id,
                        'X-Tenant-Id':'0000000000000000000000000000000000000000000'

                    }
                }
            );

            const { uploadUrl, objectKey } = response.data;

            if (!uploadUrl || !objectKey) {
                throw new Error("Invalid presigned URL response from backend.");
            }

            const s3Axios = axios.create({
                transformRequest: [(data) => data]
            })
            await s3Axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type
                }
            });

            return objectKey;

        } catch (error) {
            console.error(`S3 Upload lifecycle failed for ${type}:`, error);
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadProfileImage, isUploading };
};
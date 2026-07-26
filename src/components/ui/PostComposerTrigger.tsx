'use client';
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { Image, Smile, Video } from "lucide-react";

export default function PostComposerTrigger() {
    const router = useRouter();
    const { user } = useAuth();

    return (
        <div className="w-[70%] bg-[#f0f2f5] rounded-[20px] p-3 shadow-sm">

            <div
                onClick={() => router.push("/dashboard/create-post")}
                className="flex items-center gap-3"
            >
                <Avatar name={user?.firstName || "?"} />
                <div className="flex-1 bg-[#e4e6eb] rounded-full px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-[#d8dadf] transition">
                    {user?.firstName
                        ? `What's on your mind, ${user.firstName}?`
                        : "What's on your mind?"}
                </div>

                <div className="flex items-center gap-3 ml-2">

                    <Video size={20} className="text-red-500 cursor-pointer" />

                    <Image size={20} className="text-green-500 cursor-pointer"/>

                    <Smile size={20} className="text-yellow-500 cursor-pointer" />

                </div>
            </div>

        </div>
    );
}
'use client';
import { useState } from "react";
import ProfileHeader from "@/components/ui/ProfileHeader";
import ProfileTabs from "@/components/ui/ProfileTabs";
import AboutSection from "@/components/ui/about/AboutSection";
import SuggestedPeople from "@/components/ui/SuggestedPeople";
import { DUMMY_PROFILE } from "@/lib/dummy-profile";

export default function ProfilePage() {
    const profile = DUMMY_PROFILE;
    const [activeTab, setActiveTab] = useState("About");

    return (
        <div>
            <ProfileHeader profile={profile} />
            <ProfileTabs active={activeTab} onChange={setActiveTab} />

            {activeTab === "About" && <AboutSection profile={profile} />}

            {activeTab === "All" && (
                <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                    {profile.suggestedPeople && <SuggestedPeople people={profile.suggestedPeople} />}
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
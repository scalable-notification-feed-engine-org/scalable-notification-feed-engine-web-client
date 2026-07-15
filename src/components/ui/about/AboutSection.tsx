'use client';
import { useState } from "react";
import { Info, Pin } from "lucide-react";
import { ProfileData } from "@/types/profile";
import AboutRow from "@/components/ui/about/AboutRow";
import AboutEmptySection from "@/components/ui/about/AboutEmptySection";
import PersonalDetails from "@/components/ui/about/PersonalDetails";

const NAV_ITEMS = [
    "Intro", "Personal details", "Work", "Education", "Hobbies",
    "Interests", "Travel", "Links", "Contact info", "Names", "Details about you",
];

interface AboutSectionProps {
    profile: ProfileData | null;
}

export default function AboutSection({ profile }: AboutSectionProps) {
    const [active, setActive] = useState("Intro");
    const isOwnProfile = profile?.isOwnProfile ?? true;
    const about = profile?.about || {
        bioLines: "Welcome to your profile!",
        pinnedDetails: []
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-4">
            <nav aria-label="About sections" className="w-full md:w-56 shrink-0 bg-white border border-gray-200 rounded-saas p-3 h-fit">
                <h2 className="text-lg font-bold text-foreground px-2 mb-2" style={{ fontFamily: "var(--font-display)" }}>
                    About
                </h2>
                <ul className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible no-scrollbar">
                    {NAV_ITEMS.map((item) => (
                        <li key={item} className="shrink-0">
                            <button
                                onClick={() => setActive(item)}
                                aria-current={active === item ? "page" : undefined}
                                className={`w-full text-left px-2.5 py-2 rounded-saas text-sm font-medium whitespace-nowrap transition-colors ${
                                    active === item ? "bg-brand/10 text-brand" : "text-foreground hover:bg-background"
                                }`}
                            >
                                {item}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="flex-1 min-w-0">
                {active === "Intro" && (
                    <div className="bg-white border border-border-subtle rounded-saas p-5 space-y-5">
                        <div>
                            <h2 className="text-base font-semibold text-foreground mb-3">Bio</h2>
                            <AboutRow icon={Info} label="About you" value={about?.bioLines || ""} isOwnProfile={isOwnProfile} />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-foreground mb-3">Pinned details</h2>
                            {about?.pinnedDetails && about.pinnedDetails.length > 0 ? (
                                <ul className="space-y-2">
                                    {about.pinnedDetails.map((d, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <Pin size={18} className="text-muted" aria-hidden="true" />
                                            <span className="text-sm text-foreground">{d}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <AboutRow icon={Pin} label="Pinned details" isOwnProfile={isOwnProfile} />
                            )}
                        </div>
                    </div>
                )}

                {active === "Personal details" && (
                    <PersonalDetails about={about} key={profile?.id || "default-id"} />
                )}

                {!["Intro", "Personal details"].includes(active) && (
                    <AboutEmptySection title={active} isOwnProfile={isOwnProfile} />
                )}
            </div>
        </div>
    );
}
'use client';
import { useState } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";

const TABS = ["All", "About", "Friends", "Photos", "Reels"];

interface ProfileTabsProps {
    active: string;
    onChange: (tab: string) => void;
}

export default function ProfileTabs({ active, onChange }: ProfileTabsProps) {
    const [moreOpen, setMoreOpen] = useState(false);

    return (
        <div className="max-w-5xl mx-auto px-4 border-b border-border-subtle">
            <div className="flex items-center justify-between">
                <nav aria-label="Profile sections" className="flex items-center">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onChange(tab)}
                            aria-current={active === tab ? "page" : undefined}
                            className={`relative px-4 h-12 text-sm font-semibold transition-colors ${
                                active === tab ? "text-brand" : "text-muted hover:text-foreground"
                            }`}
                        >
                            {tab}
                            {active === tab && (
                                <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-brand" aria-hidden="true" />
                            )}
                        </button>
                    ))}
                    <div className="relative">
                        <button
                            onClick={() => setMoreOpen((v) => !v)}
                            aria-haspopup="menu"
                            aria-expanded={moreOpen}
                            className="flex items-center gap-1 px-4 h-12 text-sm font-semibold text-muted hover:text-foreground transition-colors"
                        >
                            More
                            <ChevronDown size={14} aria-hidden="true" />
                        </button>
                        {moreOpen && (
                            <div role="menu" className="absolute left-0 top-full mt-1 w-40 bg-white border border-border-subtle rounded-saas shadow-saas py-1 z-20">
                                {["Videos", "Check-ins", "Likes"].map((item) => (
                                    <button key={item} role="menuitem" className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-background">
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </nav>
                <button aria-label="More profile options" className="w-9 h-9 flex items-center justify-center rounded-md bg-background hover:bg-border-subtle text-foreground transition-colors">
                    <MoreHorizontal size={18} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}
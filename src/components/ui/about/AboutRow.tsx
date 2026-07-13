import { LucideIcon, Lock, Globe2, Pencil } from "lucide-react";

interface AboutRowProps {
    icon: LucideIcon;
    label: string;
    value?: string;
    sublabel?: string;
    isOwnProfile: boolean;
    locked?: boolean;
    audienceControl?: boolean;
}

export default function AboutRow({ icon: Icon, label, value, sublabel, isOwnProfile, locked, audienceControl }: AboutRowProps) {
    if (!value && !isOwnProfile) return null;

    return (
        <div className="flex items-center justify-between gap-3 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
                <Icon size={20} className="text-muted shrink-0" aria-hidden="true" />
                <div className="min-w-0">
                    {value ? (
                        <p className="text-sm text-foreground truncate">{value}</p>
                    ) : (
                        <button className="text-sm text-brand hover:underline text-left">
                            Add {label.toLowerCase()}
                        </button>
                    )}
                    {sublabel && <p className="text-xs text-muted">{sublabel}</p>}
                </div>
            </div>

            {isOwnProfile && value && (
                <div className="flex items-center gap-2.5 shrink-0">
                    {locked && <Lock size={14} className="text-muted" aria-label="Only visible to you" />}
                    {audienceControl && <Globe2 size={14} className="text-muted" aria-label="Visible to public" />}
                    <button aria-label={`Edit ${label}`} className="text-muted hover:text-foreground">
                        <Pencil size={14} aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}
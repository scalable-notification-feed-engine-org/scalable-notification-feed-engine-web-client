'use client';
import { useState, useRef, useEffect } from "react";
import { Globe2, Users2, Lock, ChevronDown } from "lucide-react";

const AUDIENCE_OPTIONS = [
    { value: "public", label: "Public", icon: Globe2 },
    { value: "friends", label: "Friends", icon: Users2 },
    { value: "only-me", label: "Only me", icon: Lock },
] as const;

export type AudienceValue = (typeof AUDIENCE_OPTIONS)[number]["value"];

interface AudiencePillProps {
    value: AudienceValue;
    onChange: (value: AudienceValue) => void;
    locked?: boolean;
}

export default function AudiencePill({ value, onChange, locked }: AudiencePillProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const current = AUDIENCE_OPTIONS.find((o) => o.value === value) ?? AUDIENCE_OPTIONS[0];
    const Icon = current.icon;

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    if (locked) {
        return (
            <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-background text-xs font-semibold text-muted">
        <Icon size={13} aria-hidden="true" />
                {current.label}
      </span>
        );
    }

    return (
        <div className="relative inline-block" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-background hover:bg-border-subtle text-xs font-semibold text-foreground transition-colors"
            >
                <Icon size={13} aria-hidden="true" />
                {current.label}
                <ChevronDown size={12} aria-hidden="true" />
            </button>
            {open && (
                <div role="menu" className="absolute left-0 top-full mt-1 w-36 bg-white border border-border-subtle rounded-saas shadow-saas py-1 z-20">
                    {AUDIENCE_OPTIONS.map((opt) => {
                        const OptIcon = opt.icon;
                        return (
                            <button
                                key={opt.value}
                                role="menuitem"
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background text-left"
                            >
                                <OptIcon size={14} aria-hidden="true" />
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
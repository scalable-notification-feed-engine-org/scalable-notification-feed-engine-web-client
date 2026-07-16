'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import {useState} from "react";
import {
    Home,
    Video,
    Users,
    UserPlus2,
    Grid3x3,
    MessageCircle,
    Bell,
    ChevronDown,
    LogOut,
    User
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";
import {SearchInput} from "@/components/ui/search";

const CENTER_NAV = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/reels", label: "Reels", icon: Video },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/friends", label: "Friends", icon: UserPlus2 },
];



export default function TopHeader() {
    const pathname = usePathname();
    const { user, logout } = useAuth() as { user?: { firstName?: string }; logout?: () => void };
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);


    return (
        <header className="sticky top-0 z-30 bg-card border-b border-border-subtle bg-white">
            <div className="max-w-7xl mx-auto h-14 px-4 flex items-center justify-between gap-4">

                <div className="flex items-center gap-3 shrink-0">
                    <Link href="/dashboard" className="text-lg font-semibold text-brand" style={{ fontFamily: "var(--font-display)" }}>
                        Voxa
                    </Link>
                    <div className="hidden sm:block w-56 border border-gray-400 rounded-full">
                        <SearchInput
                            placeholder="Search Voxa"
                            value={query}
                            onChange={(value) => setQuery(value)}
                        />
                    </div>
                </div>

                <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
                    {CENTER_NAV.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? "page" : undefined}
                                aria-label={label}
                                className={`relative px-5 h-14 flex items-center justify-center transition-colors ${
                                    active ? "text-brand" : "text-muted hover:text-foreground"
                                }`}
                            >
                                <Icon size={22} aria-hidden="true" />
                                {active && (
                                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-brand" aria-hidden="true" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        aria-label="Apps"
                        className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-background hover:bg-border-subtle text-foreground transition-colors"
                    >
                        <Grid3x3 size={18} aria-hidden="true" />
                    </button>
                    <Link
                        href="/messages"
                        aria-label="Messages"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-background hover:bg-border-subtle text-foreground transition-colors"
                    >
                        <MessageCircle size={18} aria-hidden="true" />
                    </Link>
                    <Link
                        href="/notifications"
                        aria-label="Notifications"
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-background hover:bg-border-subtle text-foreground transition-colors"
                    >
                        <Bell size={18} aria-hidden="true" />
                    </Link>

                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            className="flex items-center gap-1 rounded-full pl-1 pr-2 h-9 bg-background hover:bg-border-subtle transition-colors"
                        >
                            <Avatar name={user?.firstName || "?"} size="sm" />
                            <ChevronDown size={14} className="text-muted" aria-hidden="true" />
                        </button>

                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 mt-2 w-48 bg-card border border-border-subtle rounded-saas shadow-saas py-1"
                            >
                                <Link
                                    href="/profile"
                                    role="menuitem"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background"
                                >
                                    <User size={16} aria-hidden="true" />
                                    View profile
                                </Link>
                                <button
                                    role="menuitem"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        logout?.();
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-background text-left"
                                >
                                    <LogOut size={16} aria-hidden="true" />
                                    Log out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
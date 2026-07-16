'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Users, UserCircle, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Avatar from "@/components/ui/Avatar";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Home", icon: Home },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/profile", label: "Profile", icon: UserCircle },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    return (
        <nav
            aria-label="Main navigation"
            className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border-subtle py-6 pr-4 sticky top-0 h-screen"
        >
            <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 mb-4 rounded-saas hover:bg-card transition-colors"
            >
                <Avatar name={user?.firstName || "?"} />
                <span className="text-sm font-medium text-foreground truncate">
          {user?.firstName || "Your profile"}
        </span>
            </Link>

            <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const finalHref = label === "Profile" ? `/profile/${user?.id}/${user?.firstName}` : href;
                    const active = pathname === finalHref;
                    return (
                        <li key={label}>
                            <Link
                                href={finalHref}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-saas text-sm font-medium transition-colors ${
                                    active ? "bg-brand/10 text-brand" : "text-foreground hover:bg-card"
                                }`}
                            >
                                <Icon size={20} aria-hidden="true" />
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
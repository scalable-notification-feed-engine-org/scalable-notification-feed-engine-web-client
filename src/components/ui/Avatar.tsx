interface AvatarProps {
    name: string;
    size?: "sm" | "md";
    status?: "online" | "offline";
}

export default function Avatar({ name, size = "md", status }: AvatarProps) {
    const initial = name?.charAt(0)?.toUpperCase() || "?";
    const dims = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

    return (
        <span className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-gray-200 bg-brand/10 text-brand font-semibold ${dims}`}>
      {initial}
            {status && (
                <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2  border-card ${
                        status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                />
            )}
    </span>
    );
}
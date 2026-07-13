interface AboutEmptySectionProps {
    title: string;
    isOwnProfile: boolean;
}

export default function AboutEmptySection({ title, isOwnProfile }: AboutEmptySectionProps) {
    return (
        <div className="bg-white border border-border-subtle rounded-saas p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">{title}</h2>
            {isOwnProfile ? (
                <button className="text-sm text-brand hover:underline">Add {title.toLowerCase()}</button>
            ) : (
                <p className="text-sm text-muted">No {title.toLowerCase()} to show.</p>
            )}
        </div>
    );
}
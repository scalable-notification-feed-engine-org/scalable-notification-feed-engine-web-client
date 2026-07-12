export default function FeedSkeleton() {
    return (
        <div className="space-y-4" role="status" aria-label="Loading feed">
            {[0, 1, 2].map((i) => (
                <div key={i} className="bg-card border border-border-subtle rounded-saas p-4 shadow-saas animate-pulse">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-border-subtle" />
                        <div className="h-3 w-24 bg-border-subtle rounded" />
                    </div>
                    <div className="h-3 w-full bg-border-subtle rounded mb-2" />
                    <div className="h-3 w-2/3 bg-border-subtle rounded" />
                </div>
            ))}
        </div>
    );
}
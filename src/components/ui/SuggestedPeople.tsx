import { ProfileData } from "@/types/profile";
import { AvatarFallback } from "@/components/ui/AvatarPlaceholder";
import Button from "@/components/ui/Button";
import { UserPlus } from "lucide-react";

export default function SuggestedPeople({ people }: { people: NonNullable<ProfileData["suggestedPeople"]> }) {
    if (people.length === 0) return null;

    return (
        <div className="bg-white border border-border-subtle rounded-saas p-4">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-foreground">People you may know</h2>
                <button className="text-sm font-medium text-brand hover:underline">See all</button>
            </div>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {people.map((p) => (
                    <li key={p.id} className="flex flex-col items-center text-center bg-background rounded-saas p-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                            <AvatarFallback className="w-full h-full" />
                        </div>
                        <p className="text-sm font-medium text-foreground truncate w-full">{p.name}</p>
                        {p.mutualFriendsCount != null && (
                            <p className="text-xs text-muted mb-2">{p.mutualFriendsCount} mutual friends</p>
                        )}
                        <Button
                            label="Add friend"
                            icon={<UserPlus size={14} aria-hidden="true" />}
                            variant="secondary"
                            className="h-8 px-3 text-xs mt-1"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
"use client";
import { useTenantStore } from "@/store/useTenantStore";

const mockGroups = [
    { id: "uuid-1", name: "SLIIT AI Batch", slug: "sliit-ai" },
    { id: "uuid-2", name: "Proporta Team", slug: "proporta" }
];

export default function GroupSwitcher() {
    const { activeTenant, setActiveTenant } = useTenantStore();

    return (
        <div className="p-4 border-b">
            <label className="text-xs font-bold text-gray-500 uppercase">Select Group</label>
            <select
                value={activeTenant?.id || ""}
                onChange={(e) => {
                    const group = mockGroups.find(g => g.id === e.target.value);
                    if (group) setActiveTenant(group);
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-gray-100"
            >
                <option value="" disabled>Choose a group...</option>
                {mockGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
            </select>

            {activeTenant && (
                <p className="mt-2 text-xs text-green-600 font-medium">
                    Active: /{activeTenant.slug}
                </p>
            )}
        </div>
    );
}
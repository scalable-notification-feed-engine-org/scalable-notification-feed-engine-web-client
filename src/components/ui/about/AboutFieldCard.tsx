'use client';
import { useState, ReactNode } from "react";
import Button from "@/components/ui/Button";
import { profileService } from "@/api/profile/profile-service";
import AudiencePill, {type AudienceValue} from "@/components/ui/about/AudiencePill";

interface AboutFieldCardProps {
    title: string;
    fieldKey: string;
    initialValue: string;
    initialAudience?: AudienceValue;
    audienceLocked?: boolean;
    placeholder?: string;
    onSaved?: (value: string, audience: AudienceValue) => void;
    children?: (props: { value: string; setValue: (v: string) => void }) => ReactNode;
    isLast?: boolean;
}

export default function AboutFieldCard({
                                           title,
                                           fieldKey,
                                           initialValue,
                                           initialAudience = "public",
                                           audienceLocked,
                                           placeholder,
                                           onSaved,
                                           children,
                                           isLast,
                                       }: AboutFieldCardProps) {
    const [value, setValue] = useState(initialValue);
    const [savedValue, setSavedValue] = useState(initialValue);
    const [audience, setAudience] = useState<AudienceValue>(initialAudience);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const isValid = value.trim().length > 0;
    const isUnchanged = value.trim() === savedValue.trim();
    const canSave = isValid && !isUnchanged && !saving;

    const handleSave = async () => {
        if (!canSave) return;
        setSaving(true);
        setError("");
        try {
            await profileService.updatePersonalDetail({ field: fieldKey, value: value.trim(), audience });
            setSavedValue(value.trim());
            onSaved?.(value.trim(), audience);
        } catch (err) {
            console.error(`Failed to save ${fieldKey}:`, err);
            setError("Couldn't save. Try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setValue(savedValue);
        setAudience(initialAudience);
        setError("");
    };

    return (
        <div className={isLast ? "" : "pb-5 mb-5 border-b border-border-subtle"}>
            <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
            <AudiencePill value={audience} onChange={setAudience} locked={audienceLocked} />

            <div className="mt-3">
                {children ? (
                    children({ value, setValue })
                ) : (
                    <label className="block">
                        <span className="sr-only">{title}</span>
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholder}
                            className="w-full h-11 px-3 border border-border-subtle rounded-lg text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                    </label>
                )}
            </div>

            {error && <p role="alert" className="mt-2 text-xs text-ember">{error}</p>}

            <div className="flex justify-end gap-2 mt-3">
                <Button
                    label="Cancel"
                    variant="secondary"
                    fullWidth={false}
                    onClick={handleCancel}
                    className="h-9 px-4 text-sm"
                />
                <Button
                    label="Save"
                    variant="primary"
                    fullWidth={false}
                    isLoading={saving}
                    onClick={handleSave}
                    className={`h-9 px-4 text-sm ${!canSave ? "opacity-40 cursor-not-allowed" : ""} `}
                />
            </div>
        </div>
    );
}
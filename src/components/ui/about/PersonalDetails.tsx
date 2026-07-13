'use client';
import { Cake, Users2 as Family, X } from "lucide-react";
import { ProfileData } from "@/types/profile";
import AboutFieldCard from "@/components/ui/about/AboutFieldCard";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { profileService } from "@/api/profile/profile-service";

const GENDER_OPTIONS = ["Male", "Female", "Custom"];
const PRONOUN_OPTIONS = ["he/him", "she/her", "they/them"];

interface PersonalDetailsProps {
    about: ProfileData["about"];
}

export default function PersonalDetails({ about }: PersonalDetailsProps) {
    const [familyMembers, setFamilyMembers] = useState(about.familyMembers ?? []);
    const [languages, setLanguages] = useState(about.languages ?? []);
    const [newFamilyMember, setNewFamilyMember] = useState("");
    const [newLanguage, setNewLanguage] = useState("");
    const [addingFamily, setAddingFamily] = useState(false);
    const [addingLanguage, setAddingLanguage] = useState(false);

    const addFamilyMember = async () => {
        const trimmed = newFamilyMember.trim();
        if (!trimmed) return;
        setAddingFamily(true);
        try {
            const next = [...familyMembers, trimmed];
            await profileService.updatePersonalDetail({ field: "familyMembers", value: JSON.stringify(next) });
            setFamilyMembers(next);
            setNewFamilyMember("");
        } catch (err) {
            console.error("Failed to add family member:", err);
        } finally {
            setAddingFamily(false);
        }
    };

    const addLanguage = async () => {
        const trimmed = newLanguage.trim();
        if (!trimmed) return;
        setAddingLanguage(true);
        try {
            const next = [...languages, trimmed];
            await profileService.updatePersonalDetail({ field: "languages", value: JSON.stringify(next) });
            setLanguages(next);
            setNewLanguage("");
        } catch (err) {
            console.error("Failed to add language:", err);
        } finally {
            setAddingLanguage(false);
        }
    };

    return (
        <div className="bg-white border border-gray-300 rounded-saas p-5">
            <AboutFieldCard
                title="Location"
                fieldKey="currentCity"
                initialValue={about.currentCity ?? ""}
                placeholder="Current town/city"
            />

            <AboutFieldCard
                title="Home town"
                fieldKey="homeTown"
                initialValue={about.homeTown ?? ""}
                placeholder="Home town"
            />

            <AboutFieldCard
                title="Date of birth"
                fieldKey="dateOfBirth"
                initialValue={about.birthDate && about.birthYear ? `${about.birthDate} ${about.birthYear}` : ""}
            >
                {({ value, setValue }) => (
                    <div className="flex items-center gap-2">
                        <Cake size={18} className="text-muted shrink-0" aria-hidden="true" />
                        <input
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="e.g. 9 May 2000"
                            className="flex-1 h-11 px-3 border border-border-subtle rounded-lg text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                        />
                    </div>
                )}
            </AboutFieldCard>

            <div className="pb-5 mb-5 border-b border-border-subtle">
                <h3 className="text-base font-semibold text-foreground mb-3">Family members</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                    {familyMembers.map((m, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full bg-background text-sm text-foreground">
              <Family size={14} className="text-muted" aria-hidden="true" />
                            {m}
                            <button
                                aria-label={`Remove ${m}`}
                                onClick={() => setFamilyMembers((prev) => prev.filter((_, idx) => idx !== i))}
                                className="text-muted hover:text-foreground"
                            >
                <X size={13} aria-hidden="true" />
              </button>
            </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        value={newFamilyMember}
                        onChange={(e) => setNewFamilyMember(e.target.value)}
                        placeholder="Add a family member"
                        className="flex-1 h-10 px-3 border border-border-subtle rounded-lg text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    <Button
                        label="Add"
                        variant="secondary"
                        fullWidth={false}
                        isLoading={addingFamily}
                        className={`h-10 px-4 text-sm ${!newFamilyMember.trim() ? "opacity-40 cursor-not-allowed" : ""}`}
                        onClick={addFamilyMember}
                    />
                </div>
            </div>

            <AboutFieldCard
                title="Gender"
                fieldKey="gender"
                initialValue={about.gender ?? ""}
                audienceLocked
                initialAudience="only-me"
            >
                {({ value, setValue }) => (
                    <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full h-11 px-3 border border-border-subtle rounded-lg text-sm text-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                        <option value="" disabled>Select gender</option>
                        {GENDER_OPTIONS.map((g) => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                )}
            </AboutFieldCard>

            <AboutFieldCard
                title="Pronouns"
                fieldKey="pronouns"
                initialValue={about.pronouns ?? ""}
            >
                {({ value, setValue }) => (
                    <select
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full h-11 px-3 border border-border-subtle rounded-lg text-sm text-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                        <option value="" disabled>Select pronouns</option>
                        {PRONOUN_OPTIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                )}
            </AboutFieldCard>

            <div className="pb-1">
                <h3 className="text-base font-semibold text-foreground mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                    {languages.map((l, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-full bg-background text-sm text-foreground">
              {l}
                            <button
                                aria-label={`Remove ${l}`}
                                onClick={() => setLanguages((prev) => prev.filter((_, idx) => idx !== i))}
                                className="text-muted hover:text-foreground"
                            >
                <X size={13} aria-hidden="true" />
              </button>
            </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value)}
                        placeholder="Add a language"
                        className="flex-1 h-10 px-3 border border-border-subtle rounded-lg text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                    <Button
                        label="Add"
                        variant="secondary"
                        fullWidth={false}
                        isLoading={addingLanguage}
                        className={`h-10 px-4 text-sm ${!newLanguage.trim() ? "opacity-40 cursor-not-allowed" : ""}`}
                        onClick={addLanguage}
                    />
                </div>
            </div>
        </div>
    );
}
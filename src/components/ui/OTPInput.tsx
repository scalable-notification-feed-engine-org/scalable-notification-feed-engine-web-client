'use client'

import React, { useRef } from "react";

interface OTPInputProps {
    label: string;
    value: string;
    onChange: (e: { target: { value: string } }) => void;
    id: string;
    error?: string;
    length?: number;
}

export default function OTPInput({ label, value, onChange, id, error, length = 6 }: OTPInputProps) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);
    const digits = value.padEnd(length, " ").split("").slice(0, length);

    const setDigit = (index: number, char: string) => {
        const clean = char.replace(/[^0-9]/g, "");
        const next = digits.slice();
        next[index] = clean || " ";
        onChange({ target: { value: next.join("").trimEnd() } });
        if (clean && index < length - 1) refs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index].trim() && index > 0) {
            refs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);
        onChange({ target: { value: pasted } });
        refs.current[Math.min(pasted.length, length - 1)]?.focus();
    };

    return (
        <div className="mb-5">
            <label htmlFor={`${id}-0`} className="block text-sm font-medium text-ink dark:text-paper mb-2">
                {label}
            </label>
            <div className="flex gap-2 justify-between" role="group" aria-label={label}>
                {digits.map((d, i) => (
                    <input
                        key={i}
                        id={`${id}-${i}`}
                        ref={(el) => { refs.current[i] = el; }}
                        value={d.trim()}
                        onChange={(e) => setDigit(i, e.target.value.slice(-1))}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        inputMode="numeric"
                        maxLength={1}
                        aria-invalid={!!error}
                        className={`
              w-full aspect-3/4 text-center text-lg font-medium rounded-xl
              bg-white dark:bg-[#1E1A2E] text-ink dark:text-paper
              border transition-colors duration-150
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              ${error ? "border-ember" : "border-line dark:border-line-dark"}
            `}
                        style={{ fontFamily: "var(--font-mono, 'IBM Plex Mono', monospace)" }}
                    />
                ))}
            </div>
            {error && (
                <p role="alert" className="mt-1.5 text-xs text-ember">
                    {error}
                </p>
            )}
        </div>
    );
}
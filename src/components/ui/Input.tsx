'use client'

import React, { useId, useState } from "react";

interface InputProps {
    label: string;
    value: string;
    type?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
    error?: string;
}

export default function Input({ label, value, type = "text", onChange, id, error }: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const errorId = useId();
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
        <div className="mb-5">
            <label htmlFor={id} className="block text-sm font-medium text-ink dark:text-paper mb-1.5">
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={resolvedType}
                    value={value}
                    onChange={onChange}
                    aria-invalid={!!error}
                    aria-describedby={error ? errorId : undefined}
                    className={`
            w-full h-12 px-4 ${isPassword ? "pr-11" : ""}
            bg-white dark:bg-[#1E1A2E]
            border rounded-xl text-sm text-ink dark:text-paper
            placeholder:text-fog
            transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            ${error ? "border-ember" : "border-line dark:border-line-dark"}
          `}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-fog hover:text-ink dark:hover:text-paper text-xs font-medium"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                )}
            </div>
            {error && (
                <p id={errorId} role="alert" className="mt-1.5 text-xs text-ember">
                    {error}
                </p>
            )}
        </div>
    );
}
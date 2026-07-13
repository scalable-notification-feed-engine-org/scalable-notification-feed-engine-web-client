'use client'
import { ReactNode } from "react";

interface ButtonProps {
    label?: string;
    isLoading?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit';
    className?: string;
    icon?: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    fullWidth?: boolean;
    ariaLabel?: string;
}

const VARIANT_STYLES: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus-visible:ring-blue-500",
    secondary: "bg-background hover:bg-border-subtle text-foreground focus-visible:ring-primary",
    ghost: "bg-transparent hover:bg-border-subtle text-foreground focus-visible:ring-primary",
};

export default function Button({
                                   label,
                                   isLoading,
                                   onClick,
                                   type = 'button',
                                   className = '',
                                   icon,
                                   variant = 'primary',
                                   fullWidth = true,
                                   ariaLabel,
                               }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            aria-label={ariaLabel ?? (label ? undefined : "button")}
            className={`
        ${fullWidth ? "w-full" : "w-auto"} h-12 px-6
        ${VARIANT_STYLES[variant]}
        text-base font-medium
        rounded-xl transition-colors duration-150
        flex items-center justify-center gap-1.5
        disabled:opacity-70 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        cursor-pointer
        ${className}
      `}
        >
            {isLoading ? (
                <div
                    className={`w-5 h-5 border-2 rounded-full animate-spin ${
                        variant === 'primary' ? "border-white/30 border-t-white" : "border-foreground/20 border-t-foreground"
                    }`}
                    role="status"
                    aria-label="Loading"
                />
            ) : (
                <>
                    {icon}
                    {label}
                </>
            )}
        </button>
    );
}
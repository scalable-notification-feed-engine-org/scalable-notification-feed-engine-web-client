'use client'

interface ButtonProps {
    label: string;
    isLoading?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit';
    className?: string;
}

export default function Button({ label, isLoading, onClick, type = 'button', className = '' }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`
        w-full h-12 px-6
        bg-primary hover:bg-primary-hover active:bg-primary-active
        text-white text-base font-medium
        rounded-xl transition-colors duration-150
        flex items-center justify-center
        disabled:opacity-70 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        cursor-pointer
        ${className}
      `}
        >
            {isLoading ? (
                <div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    role="status"
                    aria-label="Loading"
                />
            ) : (
                label
            )}
        </button>
    );
}
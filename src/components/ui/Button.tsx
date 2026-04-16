'use client'

interface ButtonProps {
    label: string;
    isLoading?: boolean;
    onClick?: () => void;
    type?: 'button' | 'submit';
    className?: string;
}

export default function Button({label, isLoading, onClick, type = 'button', className=''}: ButtonProps) {

    return (
        <button
         type={type}
         onClick={onClick}
         className={`
          w-full px-6
          bg-primary hover:bg-primary-hover
          text-white text-base font-semibold
          rounded-custom transition-all duration-200
          flex items-center justify-center
          disabled:opacity-70 disabled:cursor-not-allowed
          cursor-pointer 
          ${className}
         `}
        >
            {isLoading? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ):(
            label
        )}
        </button>
    )

}
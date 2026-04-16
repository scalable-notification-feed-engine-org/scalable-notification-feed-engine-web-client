'use client'

import {useState} from "react";
import { Eye, EyeOff } from "lucide-react"

interface InputProps {
    label: string;
    type?: "text" | "email" | "password";
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    id: string;
}

export default function Input({label, type="text", value, onChange, id}:InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="relative w-full mb-6">
            <input
             id={id}
             type={isPassword && showPassword ? "text" : type}
             value={value}
             onChange={onChange}
             placeholder=" "
             className="peer w-full px-4 py-3 text-base border-2 border-gray-200 rounded-custom outline-none focus:border-primary bg-transparent"
            />
            <label
             htmlFor={id}
             className="absolute left-4 top-3 text-gray-400 text-base transition-all pointer-events-none
             peer-focus:-top-2.5 peer-focus:left-3 peer-focus:text-sm peer-focus:text-primary peer-focus:bg-white peer-focus:px-1
             peer-focus:[:not(placehold-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:left-3 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:text-primary peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1"
            >
                {label}
            </label>

            {isPassword && (
                <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="absolute right-4 top-3.5 text-gray-400 hover:text-primary transition-colors"
                >
                    {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>
            )}
        </div>
    );

}
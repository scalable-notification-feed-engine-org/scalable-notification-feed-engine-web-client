'use client'
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from "@/components/ui/Input";


export default function ForgotPasswordPage() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({email: ""});
    const [message, setMessage] = useState("");

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;
        const newErrors = {email:""};

        if(!email){
            newErrors.email = "Email Address is required";
            isValid = false;
        }
        setErrors(newErrors);

        if(isValid) {
            try {

                const url = `http://localhost:9092/forgot-password-request-code?email=${email}`;
                setLoading(true);
                const response = await fetch(url, {
                    method: "POST",
                });

                if (response.ok) {
                    setMessage("If an account exists for this email, you will receive a reset link shortly.");
                } else {
                    setMessage("Something went wrong. Please try again.");
                }

                console.log("message " , message);

            }catch(err){
                console.log(err);
            }finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl text-center">
            <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
            <p className="text-gray-600 mb-6">
                Enter your email address and we&#39;ll send you a link to reset your password.
            </p>

            {message ? (
                <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                    {message}
                </div>
            ) :

            <form onSubmit={handleVerify} className="space-y-4">
                <Input
                    label="Enter your Email address"
                    value={email}
                    type="email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if(errors.email) {
                            setErrors({email: ""});
                        }
                    }}
                    id="email"
                    error={errors.email}
                />
                <Button label="Verify OTP" isLoading={loading} type="submit" className="h-13"/>
            </form>
            }
        </div>
    );
}
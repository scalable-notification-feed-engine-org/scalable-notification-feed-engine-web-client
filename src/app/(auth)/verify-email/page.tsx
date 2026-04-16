'use client'
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from "@/components/ui/Input";
import {router} from "next/client";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({otp: ""});

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;
        const newErrors = {otp:""};

        if(!otp){
            newErrors.otp = "Otp is required";
            isValid = false;
        }else if(isNaN((Number(otp)))){
            newErrors.otp = "OTP must be a number";
            isValid = false
        }
        setErrors(newErrors);

        if(isValid) {
            try {
                const url = `http://localhost:8000/visitors/verify-email?email=${encodeURIComponent(email!)}&otp=${otp}`;
                setLoading(true);
                const response = await fetch(url, {
                    method: "POST",
                    headers: {'Accept': 'application/json'},
                });

                const result = await response.json();

                if (response.ok && result.data === true) {
                    await router.push("/login");
                } else {
                    alert("Invalid OTP");
                }

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
                We&#39;ve sent a 6-digit code to <span className="font-semibold">{email}</span>
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
                <Input
                    label="Enter your otp"
                    value={otp}
                    type="text"
                    onChange={(e) => {

                        setOtp(e.target.value);

                        if(errors.otp) {
                            setErrors({otp: ""});
                        }

                    }}
                    id="otp"
                    error={errors.otp}
                />
                <Button label="Verify OTP" isLoading={loading} type="submit" className="h-13"/>
            </form>

            <button className="mt-4 text-primary hover:underline text-sm font-medium">
                Resend Code
            </button>
        </div>
    );
}
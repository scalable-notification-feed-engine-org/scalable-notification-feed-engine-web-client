'use client'
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import OTPInput from "@/components/ui/OTPInput";
import apiClient from "@/lib/api-client";
import AuthLayout from "@/app/(auth)/AuthLayout";

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ otp: "" });
    const [apiError, setApiError] = useState("");
    const router = useRouter();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("")
        let isValid = true;
        const newErrors = { otp: "" };
        if (!otp) {
            newErrors.otp = "Otp is required";
            isValid = false;
        } else if (isNaN((Number(otp)))) {
            newErrors.otp = "OTP must be a number";
            isValid = false
        }
        setErrors(newErrors);
        if (isValid && email) {
            try {
                setLoading(true);
                await apiClient.post(`/users/visitors/verify-email?email=${encodeURIComponent(email!)}&otp=${otp}`)
                router.push("/login");
            } catch (err:any) {
                setApiError(err.response?.data?.message || "Invalid OTP or request expired.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <AuthLayout
            eyebrow="One more step"
            title="Verify your email"
            description={`We've sent a 6-digit code to ${email ?? "your email"}.`}
        >
            {apiError && (
                <div role="alert" className="p-3 mb-5 text-sm text-ember-text bg-ember-bg rounded-xl">
                    {apiError}
                </div>
            )}
            <form onSubmit={handleVerify}>
                <OTPInput
                    label="Enter code"
                    value={otp}
                    onChange={(e) => {
                        setOtp(e.target.value);
                        if (errors.otp) setErrors({ otp: "" });
                    }}
                    id="otp"
                    error={errors.otp}
                />
                <Button label="Verify code" isLoading={loading} type="submit" />
            </form>
            <button className="mt-5 w-full text-center text-sm font-medium text-primary hover:underline">
                Resend code
            </button>
        </AuthLayout>
    );
}
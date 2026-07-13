'use client'
import React, { useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import OTPInput from "@/components/ui/OTPInput";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import apiClient from "@/lib/api-client";
import AuthLayout from "@/app/(auth)/AuthLayout";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email');

    const [formData, setFormData] = useState({ otp: "", newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ otp: "", newPassword: "", confirmPassword: "" });
    const [message, setMessage] = useState("");
    const [apiError, setApiError] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError("");
        let isValid = true;
        const newErrors = { otp: "", newPassword: "", confirmPassword: "" };

        if (!formData.otp) {
            newErrors.otp = "OTP is required";
            isValid = false;
        } else if (isNaN((Number(formData.otp)))) {
            newErrors.otp = "OTP must be a number";
            isValid = false
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
            isValid = false;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is required";
            isValid = false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        setError(newErrors)

        if (isValid) {
            try {
                setLoading(true);
                await apiClient.post(`/users/visitors/reset-password`, {
                    email: email,
                    otp: formData.otp,
                    newPassword: formData.newPassword
                });

                alert("Password reset successful! Please login.");
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
            eyebrow="Reset password"
            title="Reset your password"
            description="Enter the code we sent you and choose a new password."
        >
            {apiError && (
                <div role="alert" className="p-3 mb-5 text-sm text-ember-text bg-ember-bg rounded-xl">
                    {apiError}
                </div>
            )}

            {message ? (
                <div role="alert" className="p-4 mb-4 text-sm text-[#712B13] bg-ember-bg rounded-xl">
                    {message}
                </div>
            ) : (
                <form onSubmit={handleReset}>
                    <OTPInput
                        label="OTP code"
                        value={formData.otp}
                        onChange={(e) => {
                            setFormData({ ...formData, otp: e.target.value });
                            if (error.otp) setError({ ...error, otp: "" })
                        }}
                        id="otp"
                        error={error.otp}
                    />
                    <Input
                        label="New password"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => {
                            setFormData({ ...formData, newPassword: e.target.value });
                            if (error.newPassword) setError({ ...error, newPassword: "" })
                        }}
                        id="new-password"
                        error={error.newPassword}
                    />
                    <Input
                        label="Confirm password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => {
                            setFormData({ ...formData, confirmPassword: e.target.value });
                            if (error.confirmPassword) setError({ ...error, confirmPassword: "" })
                        }}
                        id="confirm-password"
                        error={error.confirmPassword}
                    />

                    <Button label="Reset password" isLoading={loading} type="submit" />
                </form>
            )}
        </AuthLayout>
    );
}
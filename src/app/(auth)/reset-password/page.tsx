'use client'
import React, { useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email');

    const [formData, setFormData] = useState({ otp: "", newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({otp: "", newPassword: "", confirmPassword: ""});
    const [message, setMessage] = useState("");

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;
        const newErrors = {otp: "", newPassword: "", confirmPassword: "" };

        if(!formData.otp){
            newErrors.otp = "OTP is required";
            isValid = false;
        }else if(isNaN((Number(formData.otp)))){
            newErrors.otp = "OTP must be a number";
            isValid = false
        }

        if(!formData.newPassword){
            newErrors.newPassword = "New password is required";
            isValid = false;
        }

        if(!formData.confirmPassword){
            newErrors.confirmPassword = "Confirm password is required";
            isValid = false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage("Passwords do not match!");
            return;
        }

        setError(newErrors)

        if(isValid) {

            try {
                setLoading(true);
                const url = `http://localhost:8000/visitors/reset-password?email=${email}&otp=${formData.otp}&newPassword=${formData.newPassword}`;

                const response = await fetch(url, {method: "POST"});
                const result = await response.json();

                if (response.ok) {
                    alert("Password reset successful! Please login.");
                    router.push("/login");
                } else {
                    setError(result.message || "Reset failed. Check your OTP.");
                }
            } catch (err) {
                console.log(err);
            } finally {
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
                <div className="p-4 mb-4 text-sm text-red-700 bg-green-100 rounded-lg">
                    {message}
                </div>
            ):

            <form onSubmit={handleReset} className="space-y-4">
                <Input
                    label="OTP Code"
                    value={formData.otp}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            otp: e.target.value,
                        });

                        if(error.otp) {
                            setError({...error, otp: ""})
                        }

                    }}
                    id="otp"
                    error={error.otp}

                />
                <Input
                    label="New Password"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            newPassword: e.target.value,
                        });

                        if(error.newPassword) {
                            setError({...error, newPassword: ""})
                        }

                    }}
                    id="new-password"
                    error={error.newPassword}
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                        });

                        if(error.confirmPassword) {
                            setError({...error, confirmPassword: ""})
                        }

                    }}
                    id="confirm-password"
                    error={error.confirmPassword}
                />

                <Button label="Reset Password" isLoading={loading} type="submit" className="h-13" />
            </form>
            }
        </div>
    );
}
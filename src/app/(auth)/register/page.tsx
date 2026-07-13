'use client'
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import apiClient from "@/lib/api-client";
import axios from "axios";
import AuthLayout from "@/app/(auth)/AuthLayout";

export default function RegisterPage() {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "", contact: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ firstName: "", lastName: "", email: "", password: "", contact: "" });
    const [apiError, setApiError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let isValid = true;
        const newErrors = { firstName: "", lastName: "", email: "", password: "", contact: "" };

        if (!formData.firstName) {
            newErrors.firstName = "First name is required";
            isValid = false;
        }

        if (!formData.lastName) {
            newErrors.lastName = "Last name is required";
            isValid = false;
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
            isValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if (!formData.contact) {
            newErrors.contact = "Contact is required";
            isValid = false;
        }

        setErrors(newErrors);

        if (isValid) {
            try {
                setLoading(true);
                await apiClient.post(`/users/visitors/signup`, formData)
                router.push(`/verify-email?email=${formData.email}`);

            } catch (err) {
                if (axios.isAxiosError(err)) {
                    const msg = err.response?.data?.message || "Registration failed. Try again.";
                    setApiError(msg)
                }
            }

            setLoading(false);
        }
    }

    return (
        <AuthLayout
            wide
            eyebrow="Join Voxa"
            title="Get started"
            description="Create an account to connect with friends, family and communities of people who share your interests."
            footer={
                <>
                    Already have an account?{" "}
                    <a href="/login" className="text-primary font-semibold hover:underline">Log in</a>
                </>
            }
        >
            {apiError && (
                <div role="alert" className="p-3 mb-5 text-sm text-ember-text bg-ember-bg rounded-xl">
                    {apiError}
                </div>
            )}

            <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
                <Input
                    label="First name"
                    value={formData.firstName}
                    type="text"
                    onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value })
                        if (errors.firstName) setErrors({ ...errors, firstName: "" });
                    }}
                    id="firstName"
                    error={errors.firstName}
                />

                <Input
                    label="Last name"
                    value={formData.lastName}
                    type="text"
                    onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value })
                        if (errors.lastName) setErrors({ ...errors, lastName: "" });
                    }}
                    id="lastName"
                    error={errors.lastName}
                />

                <div className="sm:col-span-2">
                    <Input
                        label="Email address"
                        value={formData.email}
                        type="email"
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value })
                            if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                        id="email"
                        error={errors.email}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Input
                        label="Password"
                        value={formData.password}
                        type="password"
                        onChange={(e) => {
                            setFormData({ ...formData, password: e.target.value })
                            if (errors.password) setErrors({ ...errors, password: "" });
                        }}
                        id="password"
                        error={errors.password}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Input
                        label="Contact number"
                        value={formData.contact}
                        type="text"
                        onChange={(e) => {
                            setFormData({ ...formData, contact: e.target.value })
                            if (errors.contact) setErrors({ ...errors, contact: "" });
                        }}
                        id="contact"
                        error={errors.contact}
                    />
                </div>

                <div className="sm:col-span-2">
                    <Button label="Create account" type="submit" isLoading={loading} />
                </div>
            </form>
        </AuthLayout>
    )
}
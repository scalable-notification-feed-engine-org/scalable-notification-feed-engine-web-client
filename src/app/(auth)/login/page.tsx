'use client'

import React, { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from '@/context/AuthContext'
import apiClient from "@/lib/api-client";
import AuthLayout from "@/app/(auth)/AuthLayout";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [apiError, setApiError] = useState("");
    const { login } = useAuth()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError("");

        let isEmailValid = true;
        let isPasswordValid = true;
        const newErrors = { email: "", password: "" };

        if (!formData.email) {
            newErrors.email = "Email is required";
            isEmailValid = false;
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
            isPasswordValid = false;
        }

        if (isPasswordValid && formData.password.length < 6) {
            newErrors.password = "Password is too short";
            isPasswordValid = false;
        }

        setErrors(newErrors);

        if (isPasswordValid && isEmailValid) {
            try {
                setLoading(true);
                const response = await apiClient.post(`/users/visitors/login`, formData);

                const { accessToken, user } = response.data.data;

                if (accessToken) {
                    login(accessToken, user)
                }

            } catch (err) {
                const message = 'Invalid email or password';
                setApiError(message);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <AuthLayout
            eyebrow="Welcome back"
            title="Log in to Voxa"
            description="Pick up your conversations where you left them."
            footer={
                <>
                    Don&#39;t have an account?{" "}
                    <a href="/register" className="text-primary font-semibold hover:underline">Register</a>
                </>
            }
        >
            {apiError && (
                <div role="alert" className="p-3 mb-5 text-sm text-ember-text bg-ember-bg rounded-xl">
                    {apiError}
                </div>
            )}
            <form onSubmit={handleLogin}>
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

                <div className="flex items-center justify-between mb-6 -mt-1">
                    <label className="flex items-center gap-2 text-sm text-fog">
                        <input type="checkbox" className="accent-primary" />
                        Remember me
                    </label>
                    <a href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</a>
                </div>

                <Button label="Log in" type="submit" isLoading={loading} />
            </form>
        </AuthLayout>
    )
}
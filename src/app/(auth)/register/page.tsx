'use client'
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import apiClient from "@/lib/api-client";

export default function RegisterPage(){
    const [formData, setFormData] = useState({firstName:"", lastName:"", email: "", password: "", contact:""});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({firstName:"", lastName:"", email: "", password: "", contact:""});
    const [apiError, setApiError] = useState("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let isValid = true;
        const newErrors = {firstName:"", lastName:"", email: "", password: "", contact:""};

        if(!formData.firstName){
            newErrors.firstName = "First name is required";
            isValid = false;
        }

        if(!formData.lastName){
            newErrors.lastName = "Last name is required";
            isValid = false;
        }


        if(!formData.email){
            newErrors.email = "Email is required";
            isValid = false;
        }

        if(!formData.password){
            newErrors.password = "Password is required";
            isValid = false;
        }else if (formData.password.length < 6){
            newErrors.password = "Password must be at least 6 characters";
            isValid = false;
        }

        if(!formData.contact){
            newErrors.contact = "Contact is required";
            isValid = false;
        }

        setErrors(newErrors);

        if(isValid){
            try {
                 setLoading(true);
                 await apiClient.post(`/users/visitors/signup`, formData)
                 await router.push(`/verify-email?email=${formData.email}`);


            }catch(err){
                const msg = err.response?.data?.message || "Registration failed. Try again.";
               setApiError(msg)
            }

            setLoading(false);
        }

    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <h1 className="text-2xl font-bold text-primary mb-6">Voxa</h1>
            <div className="w-full max-w-xl bg-white p-8 rounded-custom">
                <h2 className="text-2xl font-semibold text-black">Get started</h2>
                <p className="mb-6">Create an account to connect with friends, family and communities of people who share your interests.</p>

                {apiError && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                       label="First Name"
                       value={formData.firstName}
                       type="text"
                       onChange={(e) => {
                           setFormData({
                               ...formData,
                               firstName: e.target.value,
                           })

                           if(errors.firstName) {
                               setErrors({...errors, firstName: ""});
                           }

                       }}
                       id="firstName"
                       error={errors.firstName}

                    />

                    <Input
                        label="Last Name"
                        value={formData.lastName}
                        type="text"
                        onChange={(e) => {
                           setFormData({
                               ...formData,
                               lastName: e.target.value,
                           })

                           if(errors.lastName) {
                               setErrors({...errors, lastName: ""});
                           }

                       }}
                        id="lastName"
                        error={errors.lastName}
                    />

                    <Input
                        label="Email Address"
                        value={formData.email}
                        type="email"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                email: e.target.value,
                            })

                            if(errors.email) {
                                setErrors({...errors, email: ""});
                            }
                        }
                        }
                        id="email"
                        error={errors.email}

                    />

                    <Input
                        label="Password"
                        value={formData.password}
                        type="password"
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                            if(errors.password) {
                                setErrors({...errors, password: ""});
                            }
                        }
                        }
                        id="password"
                        error={errors.password}
                    />

                    <div className="md:col-start-1 md:col-end-3 md:flex md:justify-center gap-10">
                        <Input
                            label="contact"
                            value={formData.contact}
                            type="text"
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    contact: e.target.value,
                                })

                                if(errors.contact) {
                                    setErrors({...errors, contact: ""});
                                }

                            }}
                            id="contact"
                            error={errors.contact}
                        />

                        <Button label="Submit" type="submit" isLoading={loading} className="h-13" />

                    </div>

                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    I already have an account?{" "}
                    <a href="#" className="text-primary font-semibold hover:underline">Login</a>
                </p>

            </div>

        </div>
    )
}
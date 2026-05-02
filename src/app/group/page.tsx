"use client"

import GroupSwitcher from "@/components/ui/GroupSwitcher";
import React, {useState} from "react";
import apiClient from "@/lib/api-client";
import Cookies from "js-cookie";
import axios from "axios";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {jwtDecode} from "jwt-decode";



export default function GroupCreatePage() {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
    })
    const [apiError, setApiError] = useState("");
    const [errors, setErrors] = useState({name: "", slug: ""});
    const [loading, setLoading] = useState(false);


    const handleGroupCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setApiError("");
        const token = Cookies.get("auth_token");

        if (!token) {
            console.log(" Fetch skipped: Token is null");
           return;
        }

        let isNameValid = true;
        let isSlugValid = true;
        const newErrors = {name: "", slug: ""};

        if(!formData.name){
            newErrors.name = "Name is required";
            isNameValid = false;
        }

        if(!formData.slug){
            newErrors.slug = "Slug is required";
            isSlugValid = false;
        }

        setErrors(newErrors);

        if(isNameValid && isSlugValid){
            try {
                const jwtPayload = jwtDecode(token);
                const userId =  jwtPayload.sub;
                const data = {
                    name: formData.name,
                    slug: formData.slug,
                    description: formData.description,
                    ownerId:userId
                }
                setLoading(true);
                const response = await apiClient.post(`/tenants/groups`, data);

                setFormData({
                    name: "",
                    slug: "",
                    description: "",
                });

                if(response.status === 201){
                    alert("Group created successfully.")
                }


            }catch(e){
                if(axios.isAxiosError(e)) {
                    const msg = e.response?.data.message || "Group create failed try again.";
                    setApiError(msg);
                }else {
                    console.error("Not an axios error",e);
                }
                setLoading(false);
            }
        }

    }

    return (
        <>
                   <main className="min-h-screen bg-slate-50">
        <div className="bg-white p-4 mb-8">
            <GroupSwitcher />
        </div>
                       {
                           apiError && (
                               <div className="bg-red-100 text-red-700 p-3 mb-4 text-sm rounded-lg">
                                   {apiError}
                               </div>
                           )
                       }

        <div className="flex justify-center px-4">
            <div className="w-full max-w-xl bg-white">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Create New Group</h1>
                    <p className="text-slate-500 text-sm">Organize your projects by creating a new group.</p>
                </header>

                <form className="flex flex-col gap-y-6" onSubmit={handleGroupCreate}>
                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <Input
                            label="Group Name"
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })

                                if (errors.name) {
                                      setErrors({...errors, name: " "})
                                }
                            }
                            }
                            error={errors.name}


                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <Input
                            label="Group Slug"
                            id="name"
                            type="text"
                            value={formData.slug}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    slug: e.target.value
                                })

                                if (errors.slug) {
                                    setErrors({...errors, name: " "})
                                }
                            }
                            }
                            error={errors.slug}


                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start">
                        <textarea
                            id="description"
                            className="flex-1 border border-slate-300 p-2 h-32 outline-none rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 resize-none"
                            placeholder="Describe what this group is about..."
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button label="Create group" type="submit" isLoading={loading} className="h-13" />
                    </div>
                </form>
            </div>
        </div>
        </main>

        </>
    )
}
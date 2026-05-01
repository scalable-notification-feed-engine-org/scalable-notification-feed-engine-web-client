"use client"

import GroupSwitcher from "@/components/ui/GroupSwitcher";
import React, {useState} from "react";
import apiClient from "@/lib/api-client";
import Cookies from "js-cookie";


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
        const teoken = Cookies.get("access_token");

        if (!teoken) {
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
                setLoading(true);
                const response = await apiClient.post({
                    baseURL: "http://localhost:8085/api/v1/tenants/groups",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: formData
                });

             console.log(response);

            }catch(e){
                // error handling
            }
        }

    }

    return (
        <>
                   <main className="min-h-screen bg-slate-50">
        <div className="bg-white border-b p-4 mb-8">
            <GroupSwitcher />
        </div>

        <div className="flex justify-center px-4">
            <div className="w-full max-w-xl bg-white">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Create New Group</h1>
                    <p className="text-slate-500 text-sm">Organize your projects by creating a new group.</p>
                </header>

                <form className="flex flex-col gap-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <label htmlFor="name" className="w-full sm:w-32 font-semibold text-slate-700 mb-1 sm:mb-0">
                            Group Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="flex-1  border border-slate-300 p-2 outline-none rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                            placeholder="e.g. Engineering Team"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center">
                        <label htmlFor="slug" className="w-full sm:w-32 font-semibold text-slate-700 mb-1 sm:mb-0">
                            Slug
                        </label>
                        <input
                            id="slug"
                            type="text"
                            className="flex-1 border border-slate-300 p-2 outline-none rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 bg-slate-50"
                            placeholder="engineering-team"
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start">
                        <label htmlFor="description" className="w-full sm:w-32 font-semibold text-slate-700 mt-2 mb-1 sm:mb-0">
                            Description
                        </label>
                        <textarea
                            id="description"
                            className="flex-1 border border-slate-300 p-2 h-32 outline-none rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 resize-none"
                            placeholder="Describe what this group is about..."
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end mt-4">
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-md shadow-blue-200 transition">
                            Create Group
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </main>

        </>
    )
}
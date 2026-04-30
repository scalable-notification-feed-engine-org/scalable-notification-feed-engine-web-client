'use client'

import React, {useState} from "react";
import Cookies from "js-cookie";

export const CreateGroupForm = () => {
    const [formData, setFormData] = useState({name: "", slug: "", description: ""});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = Cookies.get('auth_token');

        if (!token) {
            console.log(" Fetch skipped: Token is null");
            return;
        }

        const response = await fetch("http://localhost:8085/api/v1/tenants/groups", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...formData,
                ownerId: "current-user-uuid"
            }),
        });

        if (response.ok) {
            alert("Group Created Successfully!");
        }
    }
    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md" >
            <input
                className="border p-2 mb-2 w-full"
                placeholder="Group Name"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input
                className="border p-2 mb-2 w-full"
                placeholder="Slug"
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
            />
            <textarea
                className="border p-2 mb-2 w-full"
                placeholder="Description"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
            <button className="bg-blue-600 text-white p-2 rounded w-full">Create Group</button>
        </form>
    );
}
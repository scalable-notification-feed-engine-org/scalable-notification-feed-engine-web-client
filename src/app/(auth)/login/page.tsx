'use client'

import React, {useState} from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import {useAuth} from '@/context/AuthContext'
import apiClient from "@/lib/api-client";

export default function LoginPage(){
    const [formData, setFormData] = useState({email: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({email: "", password: ""});
    const [apiError, setApiError] = useState("");
    const { login } = useAuth()

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setApiError("");

      let isEmailValid = true;
      let isPasswordValid = true;
      const newErrors = {email: "", password: ""};
      
      if(!formData.email){
          newErrors.email = "Email is required";
          isEmailValid = false;
      }

     if(!formData.password){
            newErrors.password = "Password is required";
            isPasswordValid = false;
        }

     if(isPasswordValid && formData.password.length < 6){
            newErrors.password = "Password is too short";
            isPasswordValid = false;
        }

        setErrors(newErrors);

      if(isPasswordValid && isEmailValid){
          try {
              setLoading(true);
             const response =  await apiClient.post(`/users/visitors/login`, formData);
                  const { accessToken,user } = response.data;
                  if(accessToken){
                      login(accessToken, user)
                  }

          }catch(err){
              console.log("Login Failed:", err);
             const message =   err.response?.data.message || 'Invalid email or password';
             setApiError(message);
          }finally{
              setLoading(false);
          }
      }

    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center  px-4">
            <h1 className="text-4xl font-bold text-primary mb-8">Voxa</h1>

            <div className="w-full max-w-md bg-white p-8 rounded-custom ">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Login</h2>

                {apiError && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {apiError}
                    </div>
                )}
                <form onSubmit={handleLogin}>
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

                    <div className="flex flex-col items-center justify-center mb-6">
                       <label className="flex items-center text-sm text-gray-600 m-2">
                           <input type="checkbox" className="mr-2 accent-primary"/>
                           Remember me
                       </label>
                        <a href="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</a>
                    </div>
                    <Button label="Login" type="submit" isLoading={loading} className="h-13" />
                </form>
                <p className="mt-8 text-center text-sm text-gray-600">
                    Don&#39;t have an account?{" "}
                    <a href="#" className="text-primary font-semibold hover:underline">Register</a>
                </p>


            </div>

        </div>
    )
}
'use client'

import React, {useState} from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage(){
    const [formData, setFormData] = useState({email: "", password: ""});
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({email: "", password: ""});

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

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
              const response = await fetch("/api/auth/login", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: JSON.stringify(formData)

              })

              const result = await response.json();

              if(response.ok){
                  //redirect dashboard
                  console.log("Success! Token:", result.token);

              }else {

                  console.log("Login Failed:", result.message);
                  setErrors({ ...errors, email: result.message || "Login failed" });
              }
          }catch(err){
              console.log("Login Failed:", err);
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
                        <a href="#" className="text-sm text-primary hover:underline">Forgot Password?</a>
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
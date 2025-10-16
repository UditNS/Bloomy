import React, { useState } from 'react'
import axios from 'axios'
import LoginImg from '../../assets/Login.png'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { addUser } from '../../utils/userSlice'
import { Toaster, toast } from 'sonner'
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { BASE_URL } from '../../utils/constant'
import { Spinner } from "@/components/ui/spinner";
import { Link } from 'react-router'
import { useForm } from "react-hook-form"
import { Asterisk } from 'lucide-react'
function Login() {
    const [errorMsg, setErrorMsg] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const {register, handleSubmit, trigger, formState: { errors, touchedFields },
} = useForm({mode:"onBlur"})

    const handleFieldBlur = async (fieldName) => {
        const valid = await trigger(fieldName);
        if (!valid) {
        const errorMessage = errors[fieldName]?.message;
        if (errorMessage) toast.error(errorMessage);
        }
    };
    //this will handle the api call for login -> using axios(fetch can also be used)
    const handleLogin = async (data) => {
        setLoading(true);
        try{
            const res = await axios.post(BASE_URL + "/login", {
                email: data.email,
                password: data.password
            }, {withCredentials: true}) // required this to set the cookies
            
            dispatch(addUser(res.data))
            setErrorMsg("")
            navigate('/')
        }
        catch(error){
            const msg = (error?.response?.data?.message || "Something went wrong")
            setErrorMsg(msg)
            toast.error(msg)
        }
        finally{
            setLoading(false)
        }
    }
    useGSAP(() => {
        gsap.from('.img', {
            opacity:0,
            duration:0.8,
            ease: "sine.inOut",
            y: 200
        })
    })
    return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <Toaster position="bottom-right" richColors />
    {/* Card with glow effect */}
    <div className="relative group img">
        
        {/* Animated glow border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-700 rounded-xl blur-lg opacity-75 group-hover:opacity-100 group-hover:blur-xl transition duration-500 "></div>

        {/* Main content container */}
        <div className="relative flex flex-col md:flex-row bg-white dark:bg-black rounded-xl overflow-hidden">
        
            {/* Left Side - Image (hidden on mobile) */}
            <div className="hidden md:block md:w-96 lg:w-[500px] ">
                <img 
                    className="w-full h-full object-cover" 
                    src={LoginImg} 
                    alt="Login" 
                />
            </div>
            
            {/* Right Side - Login Form */}
            <div className="w-full md:w-96 lg:w-[500px] p-8 md:p-10 flex flex-col justify-center">
                {/* Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <h3 className="font-bold text-3xl md:text-5xl mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Welcome Back</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Login to access your account
                    </p>
                </div>
                
                {/* Form Fields */}
                <form onSubmit={handleSubmit(handleLogin)}>
                    <FieldSet className="w-full">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email" className="flex items-center gap-1">
                                Email
                                <Asterisk 
                                    size={12} 
                                    className="text-red-500 mt-0.5" 
                                    aria-label="required" 
                                />
                                </FieldLabel>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="Enter your email address" 
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address",
                                        },
                                    })}
                                    onBlur={() => handleFieldBlur("email")}
                                    className={`border rounded-md transition-all duration-300 
                                        ${
                                            errors.email
                                            ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-400 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                                            : "border-input focus-visible:ring-2 focus-visible:ring-pink-400 focus:border-pink-500 hover:border-pink-400"
                                        } 
                                        bg-background text-foreground placeholder:text-muted-foreground
                                    `}
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">Password<Asterisk 
                                    size={12} 
                                    className="text-red-500 mt-0.5" 
                                    aria-label="required" 
                                /></FieldLabel>
                                <Input 
                                    id="password" 
                                    type="password" 
                                    placeholder="••••••••" 
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters",
                                        },
                                        pattern: {
                                            value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                                            message: "Password must contain 1 uppercase, 1 number, and 1 special character",
                                        }
                                    })}
                                    onBlur={() => handleFieldBlur("password")}
                                    className={`border rounded-md transition-all duration-300 
                                        ${
                                            errors.password
                                            ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-400 focus:border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                                            : "border-input focus-visible:ring-2 focus-visible:ring-pink-400 focus:border-pink-500 hover:border-pink-400"
                                        } 
                                        bg-background text-foreground placeholder:text-muted-foreground
                                    `}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    {/* Alert : error */}
                    
                    {/* Login Button */}
                    <Button 
                        type="submit"
                        className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 duration-200"
                    >
                        {loading ? (<Spinner></Spinner>) : ("Login")}
                    </Button>
                </form>
                <div className='text-center mt-4 font-light text-foreground/60'>
                    New to Bloomy? <Link className='hover:underline' to='/signup'>Create an account</Link>
                </div>
            </div>
        </div>
        
    </div>
</div>
  )
}

export default Login
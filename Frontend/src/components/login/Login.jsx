import React, { useState } from 'react'
import axios from 'axios'
import LoginImg from '../../assets/Login.png'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { addUser } from '../../utils/userSlice'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {AlertCircleIcon} from 'lucide-react'
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

function Login() {
    const [email, setEmail] = useState("sydney2@gmail.com");
    const [password, setPassword] = useState("Sydney@1234")
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    //this will handle the api call for login -> using axios(fetch can also be used)
    const handleLogin = async (e) => {
        e.preventDefault()
        try{
            const res = await axios.post(BASE_URL + "/login", {
                email,
                password
            }, {withCredentials: true}) // required this to set the cookies
            dispatch(addUser(res.data))
            setError("")
            navigate('/')
        }
        catch(error){
            setError(error?.response?.data?.message || "Something went wrong")
            console.log(error)
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
                    <h3 className="font-semibold text-2xl mb-2">Welcome Back</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Login to access your account
                    </p>
                </div>
                
                {/* Form Fields */}
                <FieldSet className="w-full">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input 
                                id="email" 
                                type="email" 
                                value={email} 
                                placeholder="Enter your email address" 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input 
                                id="password" 
                                type="password" 
                                value={password} 
                                placeholder="••••••••" 
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Field>
                    </FieldGroup>
                </FieldSet>
                {/* Alert : error */}
                {error && <Alert variant="destructive" className="mt-4">
                        <AlertCircleIcon />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>

                    
                </Alert>}
                {/* Login Button */}
                <Button 
                    onClick={handleLogin} 
                    className="w-full mt-6"
                >
                    Login
                </Button>
            </div>
        </div>
    </div>
</div>
  )
}

export default Login
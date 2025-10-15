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


function Login() {
    const [email, setEmail] = useState("udit007@gmail.com");
    const [password, setPassword] = useState("Udit@1234")
    const [errorMsg, setErrorMsg] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    

    //this will handle the api call for login -> using axios(fetch can also be used)
    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true);
        try{
            const res = await axios.post(BASE_URL + "/login", {
                email,
                password
            }, {withCredentials: true}) // required this to set the cookies
            
            dispatch(addUser(res.data))
            
            setErrorMsg("")
            navigate('/')
        }
        catch(error){
            
            setErrorMsg(error?.response?.data?.message || "Something went wrong")
            toast.error(errorMsg)
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
        {<Toaster className='block sm:hidden' position="top-center" richColors/>}
        {<Toaster className='hidden sm:block' position="bottom-right" richColors/>}
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
                
                {/* Login Button */}
                <Button 
                    // disabled={!!Error || !!passwordError}
                    onClick={handleLogin} 
                    className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 duration-200"
                >
                    {loading ? (<Spinner></Spinner>) : ("")}Login
                </Button>

            </div>
        </div>
    </div>
</div>
  )
}

export default Login
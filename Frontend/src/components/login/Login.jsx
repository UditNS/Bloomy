import React, { useState } from 'react'
import axios from 'axios'
import LoginBg from "../../assets/Login_bg.png"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    //this will handle the api call for login -> using axios(fetch can also be used)
    const handleLogin = async (e) => {
        e.preventDefault()
        try{
            const res = await axios.post("http://localhost:3000/login", {
                email,
                password
            })
        }
        catch(error){
            console.log(error.message)
        }
    }

    return (
    <div className={`flex items-center justify-center min-h-screen bg-fixed`}>
        <div className=''>

        </div>
        <div className="w-full max-w-md">
        <FieldSet>
            <FieldGroup>
            <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="username" type="text" value={email} placeholder="Email" onChange={(e) => {setEmail(e.target.value)}}/>
                <FieldDescription>
                Choose a unique username for your account.
                </FieldDescription>
            </Field>
            <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldDescription>
                Must be at least 8 characters long.
                </FieldDescription>
                <Input id="password" type="password" value={password} placeholder="********" onChange={(e) => {setPassword(e.target.value)}}/>
            </Field>
            </FieldGroup>
        </FieldSet>
        <Button onClick={handleLogin} className="w-full">Login</Button >
        </div>
    </div>
  )
}

export default Login
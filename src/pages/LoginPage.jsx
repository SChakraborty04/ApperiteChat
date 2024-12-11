import React from 'react'
import { useAuth } from '../utils/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

function LoginPage() {
    const {user,handleUserLogin}=useAuth()
    const navigate=useNavigate()
    React.useEffect(() =>{
        if(user){
            navigate("/")
        }
    },[])
    const [credentials,setCredentials]=useState({
        email:'',
        password:''
    })
    const handleInputChange=(e)=>{
        let name=e.target.name
        let value=e.target.value
        setCredentials({
            ...credentials,
            [name]:value
        })
    }
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Chat Room Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={handleInputChange}
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <Button 
            className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white"
          onClick={(e)=>{handleUserLogin(e,credentials)}}>
            Login
          </Button>
          <div className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-[#4285f4] hover:underline" >
          Signup
        </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    )
}

export default LoginPage

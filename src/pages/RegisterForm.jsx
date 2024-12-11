"use client"
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

export default function RegisterForm() {
  const {handleUserRegister}=useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [credentials,setCredentials]=useState({
    name:'',
    email:'',
    password:'',
    confirmPassword:''
})
const handleInputChange=(e)=>{
  let name=e.target.name
  let value=e.target.value
  setCredentials({
      ...credentials,
      [name]:value
  })
  console.log(credentials);
}
  return (
    <div className="flex items-center justify-center min-h-screen">
    <div className="w-full max-w-[440px] space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create an Account</h1>
      </div>
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
              id="name" 
              type="text" 
              name="name"
              placeholder="Enter your name"
              value={credentials.name}
              onChange={handleInputChange}
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
        </div>
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
            <Button
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              variant="ghost"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              placeholder="Confirm your password"
              required
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleInputChange}
              className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
              type={showConfirmPassword ? "text" : "password"}
            />
            <Button
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              variant="ghost"
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">Toggle password visibility</span>
            </Button>
          </div>
        </div>
        <Button onClick={(e)=>{handleUserRegister(e,credentials)}} className="w-full bg-[#4285f4] font-normal hover:bg-[#4285f4]/90" type="submit">
          Register
        </Button>
      </form>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-[#4285f4] hover:underline" >
          Log in
        </Link>
      </div>
    </div>
    </div>
  )
}


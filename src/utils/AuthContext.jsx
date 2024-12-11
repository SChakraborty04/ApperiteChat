import {createContext,useState,useEffect, useContext} from  "react"
import { account } from "../appwriteConfig"
import { useNavigate } from "react-router-dom"
import { ID } from "appwrite"

const AuthContext=createContext()

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)
    const navigate=useNavigate()

    useEffect(()=>{
        getUserOnLoad()
    },[])

    const getUserOnLoad=async()=>{
        try{
            setUser(await account.get())
        }catch(error){
            console.log(error)
        }
        setLoading(false)
    }

    const handleLogout=async()=>{
        await account.deleteSession('current')
        setUser(null)
    }

    const handleUserLogin=async(e,cred)=>{
        e.preventDefault()
        try{
            const res=await account.createEmailPasswordSession(cred.email,cred.password)
            console.log("LoggedIn",res);
            setUser(await account.get())

            navigate('/')
        }catch(error){
            console.log("HANDLEUSERLOGIN:",error);
        }
    }
    const handleUserRegister=async(e,cred)=>{
        e.preventDefault()
        if(cred.password!==cred.confirmPassword){
            alert('Password do not match')
            return
        }
        try{
            let res=await account.create(ID.unique(),
            cred.email,
            cred.password,
            cred.name
           )
           await account.createEmailPasswordSession(cred.email,cred.password)
            console.log("Registered",res);
            setUser(await account.get())
            navigate('/')
        }catch(error){
            console.log("HANDLEUSERREGISTRATION:",error);
        }
    }

    const contextData={
        user,
        handleUserLogin,
        handleLogout,
        handleUserRegister
    }
    return(
        <AuthContext.Provider value={contextData}>
            {loading?<p>Loading...</p>:children}
        </AuthContext.Provider>
    )
}
export const useAuth=()=>{return useContext(AuthContext)}
export default AuthContext
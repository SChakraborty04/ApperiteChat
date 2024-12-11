'use client'
import { differenceInMinutes, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { Databases } from 'appwrite'
import client from '../appwriteConfig'
import variables from '../../variables/variables'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Edit, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import service from '../../appwrite/config'
import { useAuth } from '../utils/AuthContext'

function Room() {
  const database = new Databases(client)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const scrollToBottom = React.useRef(null);
  const {user,handleLogout}=useAuth()
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedMessage, setEditedMessage] = useState('');
  const [clickedAvatar, setClickedAvatar] = useState(null);

  const handleEditClick = (message) => {
    setEditingMessageId(message.$id);
    setEditedMessage(message.content);
  };

  const handleSaveClick = async (messageId) => {
    await service.editMessage(messageId, editedMessage);
    setEditingMessageId(null);
    getMessages()
  };

  useEffect(() => {
    console.log(user);
    getMessages()
    const unsubscribe=client.subscribe(`databases.${variables.appwriteDatabaseID}.collections.${variables.appwriteCollectionID}.documents`, response => {
        // Callback will be executed on changes for documents A and all files.
        if(response.events.includes("databases.*.collections.*.documents.*.create")){
            console.log("New message created.")
            setMessages(prevState=>[...prevState,response.payload])
        }
        if(response.events.includes("databases.*.collections.*.documents.*.delete")){
            console.log("Message deleted.")
            setMessages(prevState=>prevState.filter(message=>message.$id!==response.payload.$id))
        }
    });
    return ()=>{
        unsubscribe()
    }
  }, [])
  useEffect(() => {
    if (scrollToBottom.current) {
      scrollToBottom.current.scrollIntoView();
    }
  }, [messages]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);


  const getMessages = async () => {
    try {
      const response = await database.listDocuments(variables.appwriteDatabaseID, variables.appwriteCollectionID)
      console.log(response)
      setMessages(response.documents)
    } catch (error) {
      console.log(error)
    }
  }
  const deleteMessage= async (id) => {
    service.deleteMessage(id)
    //setMessages(prevState=>messages.filter(message=>message.$id!==id))
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return

    try {
      let payload={
        body:newMessage,
        user_email:user.email,
        user_name:user.name
      }
      setNewMessage('')
      await service.createMessage(payload)
      //setMessages(prevState=>[...messages,response])
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = () => {
    // Implement edit profile functionality
    console.log('Edit profile')
  }

  useEffect(() => {
    if (clickedAvatar) {
      const timer = setTimeout(() => {
        setClickedAvatar(null);
      }, 3000); // Hide the popup after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [clickedAvatar]);

  return (
    <Card className=" h-screen w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Chat Room</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User avatar" />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            {/* <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem> */}
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[80vh] w-full rounded-md border p-4">
          {messages.map((m) => (
            <div key={m.$id} className={`flex ${m.user_email===user.email ? 'justify-end' : 'justify-start'} mb-4`}>
                {m.user_email!==user.email && (
                  <div className="flex items-end relative">
                    <Avatar className="w-6 h-6 mr-2" onClick={() => setClickedAvatar(m.$id)}>
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt="User avatar" />
                    <AvatarFallback>{m.user_name[0]}</AvatarFallback>
                  </Avatar>
                  {clickedAvatar === m.$id && (
                    <div className="absolute top-full mb-2 p-2 bg-white border rounded shadow-lg">
                    <div className="text-sm text-gray-700">
                      {m.user_name}
                    </div>
                  </div>
                  )}
                  </div>
                )}
                {m.user_email===user.email&&differenceInMinutes(currentTime, parseISO(m.$updatedAt)) <= 5 && (
                 <>
                 <div className="flex flex-col items-center space-y-2 p-1">
                 <button 
                   onClick={() => deleteMessage(m.$id)} 
                   className="text-red-800 pr-2 pt-1"
                 >
                   <i className="ri-delete-bin-line"></i>
                 </button>
                 <button 
                   onClick={() => handleEditClick(m)} 
                   className="text-yellow-700 pr-2 mt-1"
                 >
                   <i className="ri-edit-line"></i>
                 </button>
                 </div>
               </>
                )}
              <div 
                className={`max-w-[70%] p-3 rounded-lg ${
                  m.user_email===user.email
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {editingMessageId === m.$id ? (
              <div>
                <span className='font-bold'>Previous message:</span> <p className='mb-2 border border-gray-50 rounded'>{m.body}</p>
                <textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  className="w-full p-2 border rounded text-black"
                />
                <Button 
                  onClick={() => handleSaveClick(m.$id)} 
                  className="text-white bg-green-500 mr-2"
                >
                  Save
                </Button>
                <Button 
                  onClick={() => setEditingMessageId(null)} 
                  className="text-white bg-red-500"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <p className="text-sm mb-1">{m.body}</p>
                <span className="text-xs opacity-70">
                  {m.$updatedAt!==m.$createdAt?<><span className=' text-start font-bold'>( Edited )</span><br></br></>:null}
                  {new Date(m.$updatedAt).toLocaleString()}
                </span>
                </>
            )}
              </div>
              <div ref={scrollToBottom}></div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex w-full space-x-2">
          <Textarea 
            placeholder="Type your message here..." 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

export default Room
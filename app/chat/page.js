"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Send, Paperclip, MoreHorizontal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

const mockContacts = [
  { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg", lastMessage: "Hey, are we still on for the meeting?", time: "10:42 AM", unread: 2 },
  { id: 2, name: "Bob Williams", avatar: "/placeholder.svg", lastMessage: "Can you send over the latest designs?", time: "9:15 AM", unread: 0 },
  { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg", lastMessage: "I've pushed the latest updates to the main branch.", time: "Yesterday", unread: 0 },
  { id: 4, name: "Diana Prince", avatar: "/placeholder.svg", lastMessage: "Let's sync up tomorrow morning.", time: "Yesterday", unread: 1 },
]

const mockMessages = {
  1: [
    { id: 1, sender: "other", text: "Hey, are we still on for the meeting?", time: "10:40 AM" },
    { id: 2, sender: "me", text: "Yes, absolutely! I'm just finishing up a few things.", time: "10:41 AM" },
    { id: 3, sender: "other", text: "Great. See you then.", time: "10:42 AM" },
  ],
  2: [
    { id: 1, sender: "other", text: "Can you send over the latest designs?", time: "9:15 AM" },
  ],
  3: [
    { id: 1, sender: "other", text: "I've pushed the latest updates to the main branch.", time: "Yesterday" },
  ],
  4: [
    { id: 1, sender: "other", text: "Let's sync up tomorrow morning.", time: "Yesterday" },
  ]
}


export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0])
  const [messages, setMessages] = useState(mockMessages[selectedContact.id])
  const [newMessage, setNewMessage] = useState("")

  const handleSelectContact = (contact) => {
    setSelectedContact(contact)
    setMessages(mockMessages[contact.id] || [])
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() === "") return
    
    const newMsg = {
      id: messages.length + 1,
      sender: 'me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, newMsg])
    setNewMessage("")
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-[calc(100vh-8rem)] gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Contacts List */}
      <Card className="md:col-span-1 lg:col-span-1 h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Chats</h2>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Search contacts..." className="pl-8" />
          </div>
        </div>
        <ScrollArea className="flex-grow">
          <div className="p-2 space-y-1">
            {mockContacts.map(contact => (
              <button
                key={contact.id}
                className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${selectedContact.id === contact.id ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                onClick={() => handleSelectContact(contact)}
              >
                <Avatar>
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                </div>
                <div className="text-xs text-gray-400 text-right">
                  <p>{contact.time}</p>
                  {contact.unread > 0 && (
                    <Badge className="mt-1 w-5 h-5 flex items-center justify-center p-0">{contact.unread}</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat Window */}
      <Card className="md:col-span-2 lg:col-span-3 h-full flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{selectedContact.name}</h3>
                  <p className="text-sm text-green-500">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-grow p-4 space-y-4">
              {messages.map(msg => (
                <motion.div 
                  key={msg.id} 
                  className={`flex items-end gap-2 ${msg.sender === 'me' ? 'justify-end' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.sender !== 'me' && <Avatar className="h-8 w-8"><AvatarImage src={selectedContact.avatar} /></Avatar>}
                  <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.sender === 'me' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <p>{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'}`}>{msg.time}</p>
                  </div>
                   {msg.sender === 'me' && <Avatar className="h-8 w-8"><AvatarFallback>Me</AvatarFallback></Avatar>}
                </motion.div>
              ))}
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input 
                  placeholder="Type a message..." 
                  className="flex-grow" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a contact to start chatting</p>
          </div>
        )}
      </Card>
    </motion.div>
  )
} 
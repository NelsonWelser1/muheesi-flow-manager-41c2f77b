
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Mail, Phone, MessageSquare, Send, Paperclip, MoreHorizontal, Clock, Check, CheckCheck } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const MessagesView = () => {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      contact: {
        id: 1,
        name: 'John Smith',
        company: 'Grand Berna Dairies',
        avatarUrl: null
      },
      lastMessage: {
        content: 'Thanks for the information about the delivery schedule',
        timestamp: '10:30 AM',
        isRead: true,
        sender: 'contact'
      },
      unread: 0
    },
    {
      id: 2,
      contact: {
        id: 2,
        name: 'Sarah Johnson',
        company: 'KAJON Coffee Limited',
        avatarUrl: null
      },
      lastMessage: {
        content: 'Could you send me the updated price list?',
        timestamp: 'Yesterday',
        isRead: false,
        sender: 'contact'
      },
      unread: 2
    },
    {
      id: 3,
      contact: {
        id: 3,
        name: 'David Brown',
        company: 'FreshEco Farms',
        avatarUrl: null
      },
      lastMessage: {
        content: 'I've attached the signed contract for your review',
        timestamp: 'Monday',
        isRead: true,
        sender: 'user'
      },
      unread: 0
    }
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 1,
      conversationId: 1,
      content: 'Hello, I wanted to check on our next delivery schedule',
      timestamp: '10:15 AM',
      sender: 'contact'
    },
    {
      id: 2,
      conversationId: 1,
      content: 'Hi John, our next delivery to Grand Berna is scheduled for Friday at 9 AM',
      timestamp: '10:20 AM',
      sender: 'user'
    },
    {
      id: 3,
      conversationId: 1,
      content: 'Do you need any specific products in larger quantities?',
      timestamp: '10:22 AM',
      sender: 'user'
    },
    {
      id: 4,
      conversationId: 1,
      content: 'Thanks for the information about the delivery schedule',
      timestamp: '10:30 AM',
      sender: 'contact'
    },
    {
      id: 5,
      conversationId: 2,
      content: 'Hi, I was wondering if you have the latest price list for specialty coffee',
      timestamp: 'Yesterday',
      sender: 'contact'
    },
    {
      id: 6,
      conversationId: 2,
      content: 'Could you send me the updated price list?',
      timestamp: 'Yesterday',
      sender: 'contact'
    }
  ]);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversation(conversationId);
    
    // Mark messages as read
    const updatedConversations = conversations.map(conv => 
      conv.id === conversationId ? {...conv, unread: 0} : conv
    );
    setConversations(updatedConversations);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    const newMessageObj = {
      id: messages.length + 1,
      conversationId: selectedConversation,
      content: newMessage,
      timestamp: 'Just now',
      sender: 'user'
    };
    
    setMessages([...messages, newMessageObj]);
    
    // Update conversation last message
    const updatedConversations = conversations.map(conv => 
      conv.id === selectedConversation ? {
        ...conv, 
        lastMessage: {
          content: newMessage,
          timestamp: 'Just now',
          isRead: true,
          sender: 'user'
        }
      } : conv
    );
    setConversations(updatedConversations);
    
    setNewMessage('');
  };

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredMessages = messages.filter(
    message => message.conversationId === selectedConversation
  );

  const selectedConversationData = conversations.find(
    conv => conv.id === selectedConversation
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100vh-280px)]">
      {/* Conversations List */}
      <Card className="md:col-span-1">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Messages</CardTitle>
            <Button variant="ghost" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search messages..."
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 p-0 h-10 rounded-none border-b">
              <TabsTrigger value="all" className="rounded-none">All</TabsTrigger>
              <TabsTrigger value="unread" className="rounded-none">Unread</TabsTrigger>
              <TabsTrigger value="flagged" className="rounded-none">Flagged</TabsTrigger>
            </TabsList>
            <ScrollArea className="h-[calc(100vh-380px)]">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-gray-50' : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={conversation.contact.avatarUrl} alt={conversation.contact.name} />
                      <AvatarFallback>{getInitials(conversation.contact.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium truncate">{conversation.contact.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.lastMessage.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage.sender === 'user' && (
                          <span className="mr-1 text-gray-400">You:</span>
                        )}
                        {conversation.lastMessage.content}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">{conversation.contact.company}</span>
                        {conversation.unread > 0 && (
                          <Badge className="rounded-full px-2 text-xs">{conversation.unread}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* Message Content */}
      <Card className="md:col-span-2 flex flex-col">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">Your Messages</h3>
              <p className="mt-2 text-sm text-gray-500">Select a conversation to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            <CardHeader className="p-4 border-b flex-shrink-0">
              {selectedConversationData && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-9 w-9 mr-3">
                      <AvatarImage 
                        src={selectedConversationData.contact.avatarUrl} 
                        alt={selectedConversationData.contact.name} 
                      />
                      <AvatarFallback>
                        {getInitials(selectedConversationData.contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        {selectedConversationData.contact.name}
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        {selectedConversationData.contact.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Contact</DropdownMenuItem>
                        <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
                        <DropdownMenuItem>Mark as Unread</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete Conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </CardHeader>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'contact' && (
                      <Avatar className="h-8 w-8 mr-2 mt-1">
                        <AvatarFallback>
                          {getInitials(selectedConversationData?.contact.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="flex justify-end items-center mt-1 gap-1">
                        <span className="text-xs opacity-70">{message.timestamp}</span>
                        {message.sender === 'user' && (
                          <CheckCheck className="h-3 w-3 opacity-70" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type your message..."
                  className="min-h-10 resize-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button className="rounded-full" size="icon" onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default MessagesView;

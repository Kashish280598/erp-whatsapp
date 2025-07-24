import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  IconSearch, 
  IconDotsVertical, 
  IconPlus, 
  IconCircle, 
  IconMicrophone, 
  IconPaperclip,
  IconMoodSmile,
  IconDownload,
  IconFileText,
  IconSend,
  IconArrowLeft
} from '@tabler/icons-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isGroup?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'contact';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileName?: string;
  fileSize?: string;
}

const WhatsAppChat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data for users
  const users: User[] = [
    {
      id: '1',
      name: 'A',
      avatar: 'G',
      lastMessage: 'Hello, How are you?',
      timestamp: '11:48 AM',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'B',
      avatar: '👶',
      lastMessage: 'Thanks for the update!',
      timestamp: '11:34 AM',
      isOnline: false
    },
    {
      id: '3',
      name: 'C',
      avatar: '✈️',
      lastMessage: 'Meeting scheduled for tomorrow',
      timestamp: '11:33 AM',
      isOnline: true
    },
    {
      id: '4',
      name: 'D',
      avatar: '👥',
      lastMessage: 'This message was deleted',
      timestamp: '5:46 AM',
      isOnline: false
    },
    {
      id: '5',
      name: 'E',
      avatar: '👥',
      lastMessage: 'Got it 👍',
      timestamp: '12:15 AM',
      isOnline: false
    },
    {
      id: '6',
      name: 'F',
      avatar: '👩',
      lastMessage: 'Will check and get back to you',
      timestamp: '12:02 AM',
      isOnline: true
    },
    {
      id: '7',
      name: 'G',
      avatar: '⚛️',
      lastMessage: 'New job opportunities available',
      timestamp: 'Yesterday',
      isOnline: false
    }
  ];

  // Initialize messages for each user
  useEffect(() => {
    const initialMessages: { [key: string]: Message[] } = {};
    users.forEach(user => {
      if (user.id === '1') {
        initialMessages[user.id] = [
          {
            id: '1',
            sender: 'user',
            content: 'Thank You.',
            timestamp: '3:53 PM',
            type: 'text'
          },
          {
            id: '2',
            sender: 'contact',
            content: 'Hey',
            timestamp: '6:34 PM',
            type: 'text'
          },
          {
            id: '3',
            sender: 'contact',
            content: 'Hey',
            timestamp: '6:34 PM',
            type: 'file',
            fileName: 'Invoice_BIDU8262',
            fileSize: '56 kB'
          },
          {
            id: '4',
            sender: 'contact',
            content: 'Hey',
            timestamp: '11:48 AM',
            type: 'text'
          },
          {
            id: '5',
            sender: 'user',
            content: 'hi',
            timestamp: '2:21 PM',
            type: 'text'
          }
        ];
      } else {
        initialMessages[user.id] = [];
      }
    });
    setMessages(initialMessages);
  }, []);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'user',
        content: message.trim(),
        timestamp: new Date().toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        }),
        type: 'text'
      };

      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
      }));

      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredUsers = users.filter(user => {
    if (activeFilter === 'unread') return user.unreadCount && user.unreadCount > 0;
    if (activeFilter === 'favourites') return false; // Add favorite logic
    if (activeFilter === 'groups') return user.isGroup;
    return true;
  });

  const currentMessages = selectedUser ? messages[selectedUser.id] || [] : [];

  return (
    <div className="flex h-screen bg-neutral-50 font-sans overflow-hidden">
      {/* Left Panel - User List */}
      <div className="w-full md:w-1/3 bg-white border-r border-neutral-200 flex flex-col min-h-0 md:block">
        {/* Mobile: Show user list when no chat is selected, hide when chat is active */}
        <div className={`${selectedUser ? 'hidden md:block' : 'block'}`}>
          {/* Header */}
          <div className="bg-primary text-white p-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Chat</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary-600 h-8 w-8">
                <IconPlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary-600 h-8 w-8">
                <IconCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary-600 h-8 w-8">
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-2 bg-neutral-50 flex-shrink-0">
            <div className="relative">
              <IconSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400 h-3 w-3" />
              <Input
                placeholder="Search or start a new chat"
                className="pl-7 bg-white border-neutral-200 text-xs h-8"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-neutral-200 flex-shrink-0">
            {['all', 'unread', 'favourites', 'groups'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`flex-1 py-2 px-3 text-xs font-medium capitalize transition-colors ${
                  activeFilter === filter
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* User List */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-neutral-50 transition-colors ${
                  selectedUser?.id === user.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="text-xs bg-neutral-200">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-neutral text-xs truncate">{user.name}</h3>
                    <span className="text-xs text-neutral-400">{user.timestamp}</span>
                  </div>
                  <p className="text-xs text-neutral-400 truncate">{user.lastMessage}</p>
                </div>
                {user.unreadCount && user.unreadCount > 0 && (
                  <Badge className="bg-primary text-white text-xs rounded-full min-w-[16px] h-4 text-[10px]">
                    {user.unreadCount}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-1 flex flex-col bg-neutral-50 min-h-0 md:block">
        {/* Mobile: Show chat when user is selected, hide when no user */}
        <div className={`${selectedUser ? 'block' : 'hidden md:block'} h-full flex flex-col`}>
          {selectedUser ? (
            <>
              {/* Mobile Status Bar */}
              <div className="md:hidden bg-success h-1"></div>
              
              {/* Chat Header */}
              <div className="bg-white border-b border-neutral-200 p-3 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  {/* Mobile back button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden h-7 w-7"
                    onClick={() => setSelectedUser(null)}
                  >
                    <IconArrowLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-neutral-200">
                      {selectedUser.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium text-neutral text-sm">{selectedUser.name}</h2>
                    {selectedUser.isOnline && (
                      <p className="text-xs text-success">online</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <IconSearch className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <IconDotsVertical className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Chat Messages */}
              <div 
                className="flex-1 overflow-y-auto p-3 min-h-0 bg-white"
              >
                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block max-w-[85%] md:max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-neutral-100 text-neutral shadow-sm'
                      }`}
                    >
                      {msg.type === 'file' && (
                        <div className="mb-2">
                          <div className="flex items-center gap-2 bg-white p-2 rounded border">
                            <IconFileText className="h-3 w-3 text-primary" />
                            <div className="flex-1">
                              <p className="text-xs font-medium">{msg.fileName}</p>
                              <p className="text-xs text-neutral-400">{msg.fileSize}</p>
                            </div>
                            <IconDownload className="h-3 w-3 text-neutral-400 cursor-pointer" />
                          </div>
                        </div>
                      )}
                      <p className="text-xs break-words">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-100' : 'text-neutral-400'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Fixed at bottom */}
              <div className="bg-white border-t border-neutral-200 p-3 flex-shrink-0 mt-auto">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-neutral-400 h-8 w-8">
                    <IconPaperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message"
                      className="pr-20 text-xs h-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-neutral-400 h-6 w-6"
                    >
                      <IconMoodSmile className="h-3 w-3" />
                    </Button>
                  </div>
                  {message.trim() ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary h-8 w-8"
                      onClick={handleSendMessage}
                    >
                      <IconSend className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-neutral-400 h-8 w-8"
                    >
                      <IconMicrophone className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Empty state when no user is selected (desktop only)
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg">💬</span>
                </div>
                <h3 className="text-sm font-medium text-neutral mb-1">Select a chat</h3>
                <p className="text-xs text-neutral-400">Choose a conversation from the list to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppChat; 
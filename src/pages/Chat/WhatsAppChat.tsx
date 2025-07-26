import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  IconSearch, 
  IconMicrophone, 
  IconDownload,
  IconFileText,
  IconSend,
  IconArrowLeft
} from '@tabler/icons-react';
import { useGetWhatsAppContactsQuery, useLazyGetWhatsAppMessagesBetweenQuery } from '@/lib/api/auth/auth-api';
import { useSocket } from '@/providers/socket-provider';

interface User {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
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
  isOutgoing?: boolean;
  messageType?: string;
  createdAt?: string;
}

const WhatsAppChat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [triggerGetMessages, { isFetching: isMessagesFetching }] = useLazyGetWhatsAppMessagesBetweenQuery();

  const { socket, isConnected } = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on('message', (message: any) => {
        if (message.trim() && selectedUser) {
          const newMessage: Message = {
            id: Date.now().toString(),
            sender: 'contact',
            content: message.trim(),
            timestamp: new Date().toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            }),
            type: 'text',
            isOutgoing: false,
            messageType: 'text',
            createdAt: new Date().toISOString()
          };
    
          setMessages(prev => ({
            ...prev,
            [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage]
          }));
    
          setMessage('');
        }
      });
    }
  }, [socket, isConnected]);
  
  const { data: contacts, isLoading: isContactsLoading, isError: isContactsError, refetch } = useGetWhatsAppContactsQuery();
  const users: User[] = (contacts || []).map((c: any) => ({
    id: String(c.id),
    name: c.name || c.email || 'Unknown',
    avatar: c.name ? c.name.charAt(0).toUpperCase() : (c.email ? c.email.charAt(0).toUpperCase() : 'U'),
    lastMessage: '',
    timestamp: '',
    // unreadCount: 0,
    isOnline: false,
    isGroup: false,
  }));

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
            type: 'text',
            isOutgoing: true,
            messageType: 'text',
            createdAt: '2023-10-27T15:53:00Z'
          },
          {
            id: '2',
            sender: 'contact',
            content: 'Hey',
            timestamp: '6:34 PM',
            type: 'text',
            isOutgoing: false,
            messageType: 'text',
            createdAt: '2023-10-27T18:34:00Z'
          },
          {
            id: '3',
            sender: 'contact',
            content: 'Hey',
            timestamp: '6:34 PM',
            type: 'file',
            fileName: 'Invoice_BIDU8262',
            fileSize: '56 kB',
            isOutgoing: false,
            messageType: 'file',
            createdAt: '2023-10-27T18:34:00Z'
          },
          {
            id: '4',
            sender: 'contact',
            content: 'Hey',
            timestamp: '11:48 AM',
            type: 'text',
            isOutgoing: false,
            messageType: 'text',
            createdAt: '2023-10-27T10:48:00Z'
          },
          {
            id: '5',
            sender: 'user',
            content: 'hi',
            timestamp: '2:21 PM',
            type: 'text',
            isOutgoing: true,
            messageType: 'text',
            createdAt: '2023-10-27T14:21:00Z'
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
        type: 'text',
        isOutgoing: true,
        messageType: 'text',
        createdAt: new Date().toISOString()
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
    if (activeFilter === 'unread') return false;
    if (activeFilter === 'favourites') return false; // Add favorite logic
    if (activeFilter === 'groups') return user.isGroup;
    if (search.trim()) {
      return user.name.toLowerCase().includes(search.trim().toLowerCase());
    }
    return true;
  });

  // Ensure currentMessages is always an array and filter out undefined
  const currentMessages = selectedUser ? messages[selectedUser.id] || [] : [];
  // const currentMessages = selectedUser ? (messages[selectedUser.id] || []).filter(Boolean) : [];

  // Update the contact click handler
  const handleSelectUser = async (user: User, mobileNo: string) => {
    setSelectedUser(user);
    try {
      const result: any = await triggerGetMessages({ toNumber: mobileNo }).unwrap();
      const messagesArray: Message[] = Array.isArray(result.data?.messages) ? result.data.messages : [];
      setMessages(prev => ({
        ...prev,
        [user.id]: messagesArray,
      }));
    } catch {
      setMessages(prev => ({
        ...prev,
        [user.id]: [],
      }));
    }
  };

  if (isContactsLoading) {
    return <div className="flex items-center justify-center h-full">Loading contacts...</div>;
  }
  if (isContactsError) {
    return <div className="flex items-center justify-center h-full text-red-500">Failed to load contacts. <Button onClick={() => refetch()}>Retry</Button></div>;
  }

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
            {/* <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary-600 h-8 w-8">
                <IconPlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary-600 h-8 w-8">
                <IconCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:bg-primary-600 h-8 w-8">
                <IconDotsVertical className="h-4 w-4" />
              </Button>
            </div> */}
          </div>

          {/* Search Bar */}
          <div className="p-2 bg-neutral-50 flex-shrink-0">
            <div className="relative">
              <IconSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400 h-3 w-3" />
              <Input
                placeholder="Search or start a new chat"
                className="pl-7 bg-white border-neutral-200 text-xs h-8"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-neutral-200 flex-shrink-0">
            {[].map((filter) => (
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
                onClick={() => handleSelectUser(user, contacts?.find(c => String(c.id) === user.id)?.mobileNo || '')}
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
                {/* {user.unreadCount && user.unreadCount > 0 && (
                  <Badge className="bg-primary text-white text-xs rounded-full min-w-[16px] h-4 text-[10px]">
                    {user.unreadCount}
                  </Badge>
                )} */}
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
            isMessagesFetching ? (
              <div className="flex-1 flex items-center justify-center bg-white">
                <span>Loading messages...</span>
              </div>
            ) : (
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
                  {/* <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <IconSearch className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <IconDotsVertical className="h-3 w-3" />
                    </Button>
                  </div> */}
                </div>

                {/* Chat Messages */}
                <div 
                  className="flex-1 overflow-y-auto p-3 min-h-0 bg-white"
                >
                  {currentMessages.map((msg) => (
                    <div key={msg.id} className={`mb-3 ${msg.isOutgoing === true ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block max-w-[85%] md:max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          msg.isOutgoing === true
                            ? 'bg-primary text-white'
                            : 'bg-neutral-100 text-neutral shadow-sm'
                        }`}
                      >
                        {msg.messageType === 'media' && (
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
                        <p className={`text-xs mt-1 ${msg.isOutgoing === true ? 'text-primary-100' : 'text-neutral-400'}`}>
                          {msg.timestamp || msg.createdAt}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input - Fixed at bottom */}
                <div className="bg-white border-t border-neutral-200 p-3 flex-shrink-0 mt-auto">
                  <div className="flex items-center gap-2">
                    {/* <Button variant="ghost" size="icon" className="text-neutral-400 h-8 w-8">
                      <IconPaperclip className="h-4 w-4" />
                    </Button> */}
                    <div className="flex-1 relative">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message"
                        className="pr-20 text-xs h-8"
                      />
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-neutral-400 h-6 w-6"
                      >
                        <IconMoodSmile className="h-3 w-3" />
                      </Button> */}
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
            )
          ) : (
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
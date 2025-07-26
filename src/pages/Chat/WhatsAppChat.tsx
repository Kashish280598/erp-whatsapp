import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { 
  IconSearch, 
  IconMicrophone, 
  IconDownload,
  IconFileText,
  IconSend,
  IconArrowLeft
} from '@tabler/icons-react';
import { useWhatsAppSocket } from '@/hooks/useWhatsAppSocket';
import axios from 'axios';
import { API_CONFIG, AUTH_CONFIG } from '@/lib/api/config';

const myMobileNo = '919712323801'; // TODO: Replace with actual logged-in user's mobile number

// Helper function to get auth token
const getAuthToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${AUTH_CONFIG.cookieNames.token}=`))
    ?.split('=')[1];
};

interface User {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  // unreadCount?: number;
  isOnline?: boolean;
  isGroup?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'contact' | 'me' | 'them';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
  fileName?: string;
  fileSize?: string;
  isOutgoing?: boolean; // Added for new_code
  messageType?: string; // Added for new_code
  createdAt?: string; // Added for new_code
}

const WhatsAppChat: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Socket integration - replace all REST API calls with socket
  const {
    isSocketConnected,
    isSocketAuthenticated,
    joinWhatsAppConversation,
    fetchContacts,
    contacts: socketContacts,
    messages: socketMessages,
    isLoading,
    lastError
  } = useWhatsAppSocket();

  // Use socket contacts instead of REST API
  const contacts = socketContacts;
  const isContactsLoading = isLoading && socketContacts.length === 0;
  const isContactsError = !!lastError;
  // Map API contacts to User[] shape for UI
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

  // Fetch contacts when component mounts
  useEffect(() => {
    if (isSocketConnected && isSocketAuthenticated) {
      fetchContacts();
    }
  }, [isSocketConnected, isSocketAuthenticated, fetchContacts]);

  // Handle socket messages response
  useEffect(() => {
    if (socketMessages && selectedUser) {
      const formattedMessages = socketMessages.messages?.map((msg: any) => ({
        id: msg.id,
        sender: msg.isOutgoing ? 'user' : 'contact',
        content: msg.content,
        timestamp: formatTimestamp(msg.createdAt),
        type: 'text',
        isOutgoing: msg.isOutgoing,
        messageType: msg.messageType,
        createdAt: msg.createdAt
      })) || [];

      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: formattedMessages
      }));

      // Set conversation ID if available
      if (socketMessages.conversationId) {
        if (isSocketAuthenticated) {
          joinWhatsAppConversation(socketMessages.conversationId);
        }
      }
    }
  }, [socketMessages, selectedUser, isSocketAuthenticated, joinWhatsAppConversation]);

  // Socket event listeners for real-time messaging
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const messageData = event.detail;
      console.log('📨 Received new message event:', messageData);
      
      if (messageData && messageData.message) {
        const newMessage: Message = {
          id: messageData.message.id,
          sender: messageData.message.isOutgoing ? 'me' : 'them',
          content: messageData.message.content,
          timestamp: formatTimestamp(messageData.message.createdAt),
          type: 'text',
          isOutgoing: messageData.message.isOutgoing,
          messageType: messageData.message.messageType,
          createdAt: messageData.message.createdAt
        };

        console.log('📝 Formatted new message:', newMessage);

        // Add message to the appropriate conversation
        if (selectedUser) {
          const contact = contacts?.find(c => String(c.id) === selectedUser.id);
          const mobileNo = contact?.number || contact?.mobileNo || '';
          
          // Simplified relevance check - show all messages for the current conversation
          const isRelevantMessage = true; // Always show messages for the current conversation
          
          console.log('Message relevance check:', {
            messageMobileNo: messageData.message.mobileNo,
            contactMobileNo: mobileNo,
            isOutgoing: messageData.message.isOutgoing,
            type: messageData.type,
            isRelevant: isRelevantMessage
          });
          
          if (isRelevantMessage) {
            setMessages(prev => {
              const existingMessages = prev[selectedUser.id] || [];
              
              // More thorough duplicate check
              const messageExists = existingMessages.some(msg => 
                msg.id === newMessage.id || 
                (msg.content === newMessage.content && 
                 msg.isOutgoing === newMessage.isOutgoing &&
                 Math.abs(new Date(msg.createdAt || '').getTime() - new Date(newMessage.createdAt || '').getTime()) < 10000)
              );
              
              if (!messageExists) {
                console.log('✅ Adding new real-time message to UI:', newMessage.id, newMessage.content, newMessage.timestamp);
                return {
                  ...prev,
                  [selectedUser.id]: [...existingMessages, newMessage]
                };
              } else {
                console.log('⚠️ Real-time message already exists, skipping:', newMessage.id, newMessage.content);
                return prev;
              }
            });
          } else {
            console.log('⚠️ Message not relevant to current conversation:', messageData.message.mobileNo, mobileNo);
          }
        }
      }
    };

    const handleMessageSent = (event: CustomEvent) => {
      const sentData = event.detail;
      console.log('✅ Message sent confirmation:', sentData);
      
      // Update the temporary message with the real message data
      if (selectedUser && sentData.message) {
        setMessages(prev => {
          const existingMessages = prev[selectedUser.id] || [];
          const updatedMessages = existingMessages.map(msg => {
            if (msg.id.startsWith('temp_') && msg.content === sentData.message.content) {
              return {
                ...msg,
                id: sentData.message.id,
                timestamp: formatTimestamp(sentData.message.createdAt),
                createdAt: sentData.message.createdAt
              };
            }
            return msg;
          });
          
          return {
            ...prev,
            [selectedUser.id]: updatedMessages
          };
        });
      }
    };

    const handleMessageError = (event: CustomEvent) => {
      const errorData = event.detail;
      console.error('❌ Message error:', errorData);
      
      // Remove the optimistic message on error
      if (selectedUser && errorData.message) {
        setMessages(prev => ({
          ...prev,
          [selectedUser.id]: (prev[selectedUser.id] || []).filter(m => 
            !(m.id.startsWith('temp_') && m.content === errorData.message.content)
          )
        }));
      }
    };

    // Add event listeners
    window.addEventListener('new_message', handleNewMessage as EventListener);
    window.addEventListener('message_sent', handleMessageSent as EventListener);
    window.addEventListener('message_error', handleMessageError as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('new_message', handleNewMessage as EventListener);
      window.removeEventListener('message_sent', handleMessageSent as EventListener);
      window.removeEventListener('message_error', handleMessageError as EventListener);
    };
  }, [selectedUser, contacts]);

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) {
      console.warn('No timestamp provided to formatTimestamp');
      return 'Invalid Date';
    }
    
    try {
      // Handle different timestamp formats
      let date: Date;
      
      if (typeof timestamp === 'string') {
        // If it's already a valid ISO string, use it directly
        if (timestamp.includes('T') || timestamp.includes('Z')) {
          date = new Date(timestamp);
        } else {
          // Try parsing as a number (timestamp)
          const numTimestamp = parseInt(timestamp);
          if (!isNaN(numTimestamp)) {
            date = new Date(numTimestamp);
          } else {
            date = new Date(timestamp);
          }
        }
      } else {
        date = new Date(timestamp);
      }
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date created from timestamp:', timestamp);
        return 'Invalid Date';
      }
      
      const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      console.log('Timestamp formatting:', { original: timestamp, formatted: formattedTime });
      return formattedTime;
    } catch (error) {
      console.error('Error formatting timestamp:', timestamp, error);
      return 'Invalid Date';
    }
  };

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    const newMessage: Message = {
      id: `temp_${Date.now()}`,
      content: message.trim(),
      sender: 'me',
      timestamp: new Date().toISOString(),
      type: 'text',
      isOutgoing: true,
      messageType: 'text',
      createdAt: new Date().toISOString()
    };

    // Add message to UI immediately (optimistic update)
    setMessages(prev => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage] as Message[]
    }));

    // Clear input
    setMessage('');

    try {
      // Get the mobile number for the selected user
      const contact = contacts?.find(c => String(c.id) === selectedUser.id);
      const mobileNo = contact?.number || contact?.mobileNo || '';
      
      if (!mobileNo) {
        console.error('No mobile number found for selected user');
        return;
      }

      // Send message via API
      const response = await axios.post(`${API_CONFIG.baseURL}/api/whatsapp/send-message`, {
        to: mobileNo,
        message: newMessage.content
      }, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        console.log('Message sent successfully:', response.data);
        // The real message will be added via socket event
      } else {
        console.error('Failed to send message:', response.data.error);
        // Remove the optimistic message on error
        setMessages(prev => ({
          ...prev,
          [selectedUser.id]: (prev[selectedUser.id] || []).filter(m => m.id !== newMessage.id)
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the optimistic message on error
      setMessages(prev => ({
        ...prev,
        [selectedUser.id]: (prev[selectedUser.id] || []).filter(m => m.id !== newMessage.id)
      }));
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

  // Update the contact click handler - use REST API to fetch messages
  const handleSelectUser = async (user: User, mobileNo: string) => {
    console.log('handleSelectUser called with:', { user, mobileNo });
    setSelectedUser(user);
    
    // Clear existing messages for this user to prevent duplicates
    setMessages(prev => ({
      ...prev,
      [user.id]: []
    }));
    
    console.log({mobileNo})

    if (mobileNo) {
      // Clean the mobile number - remove + and any spaces
      const cleanMobileNo = mobileNo.replace(/^\+/, '').replace(/\s/g, '');
      console.log('Making API call with:', { fromNumber: myMobileNo, toNumber: cleanMobileNo });
      
      try {
        const token = getAuthToken();
        const response = await axios.get(`${API_CONFIG.baseURL}/api/whatsapp/messages/between`, {
          params: {
            fromNumber: myMobileNo,
            toNumber: cleanMobileNo
          },
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('API response:', response.data);
        if (response.data && response.data.success) {
          // Map backend messages to UI message format if needed
          const backendMessages = response.data.data;
          console.log('Backend messages:', backendMessages);
          
          // Remove duplicates from backend messages
          const uniqueMessages = backendMessages.filter((msg: any, index: number, self: any[]) => 
            index === self.findIndex((m: any) => m.id === msg.id)
          );
          
          const formattedMessages = uniqueMessages.map((msg: any) => {
            // Use the isOutgoing field directly from the backend
            const isOutgoing = Boolean(msg.isOutgoing);
            console.log('Message isOutgoing from backend:', msg.isOutgoing, 'Final isOutgoing:', isOutgoing);
            
            return {
              id: msg.id,
              sender: isOutgoing ? 'me' : 'them',
              content: msg.content,
              timestamp: formatTimestamp(msg.createdAt),
              type: msg.messageType || 'text',
              isOutgoing: isOutgoing,
              messageType: msg.messageType,
              createdAt: msg.createdAt
            };
          });
          console.log('Formatted messages:', formattedMessages);
          setMessages(prev => ({
            ...prev,
            [user.id]: formattedMessages
          }));
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    } else {
      console.log('No mobile number provided, skipping API call');
    }
  };

  if (isContactsLoading) {
    return <div className="flex items-center justify-center h-full">Loading contacts...</div>;
  }
  if (isContactsError) {
    return <div className="flex items-center justify-center h-full text-red-500">Failed to load contacts. <Button onClick={() => fetchContacts()}>Retry</Button></div>;
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
                onClick={() => {
                  const contact = contacts?.find(c => String(c.id) === user.id);
                  console.log({contact})
                  const mobileNo = contact?.number || contact?.mobileNo || '';
                  console.log('Selected user:', user, 'Contact:', contact, 'MobileNo:', mobileNo);
                  handleSelectUser(user, mobileNo);
                }}
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
                {currentMessages.map((msg) => {
                  const isOutgoing = Boolean(msg.isOutgoing);
                  console.log('Rendering message:', msg.id, 'isOutgoing:', isOutgoing, 'sender:', msg.sender);
                  
                  return (
                    <div key={msg.id} className={`mb-4 ${isOutgoing ? 'text-right' : 'text-left'}`}>
                      <div
                        className={`inline-block max-w-[85%] md:max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                          isOutgoing
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-neutral-100 text-neutral-800 rounded-bl-md'
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
                        <p className="text-sm break-words leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-2 ${isOutgoing ? 'text-primary-100' : 'text-neutral-500'}`}>
                          {formatTimestamp(msg.timestamp || msg.createdAt || '')}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
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
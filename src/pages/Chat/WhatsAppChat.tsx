import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
import { 
  IconSearch, 
  IconDownload,
  IconFileText,
  IconSend,
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
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Socket integration - replace all REST API calls with socket
  const {
    isSocketConnected,
    isSocketAuthenticated,
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

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Fetch contacts when component mounts
  useEffect(() => {
    if (isSocketConnected && isSocketAuthenticated) {
      fetchContacts();
    }
  }, [isSocketConnected, isSocketAuthenticated, fetchContacts]);

  // Debug selected user changes
  useEffect(() => {
    if (selectedUser) {
      console.log('🔄 Selected user details:', {
        id: selectedUser.id,
        name: selectedUser.name,
        mobileNo: contacts?.find(c => String(c.id) === selectedUser.id)?.mobileNo
      });
    }
  }, [selectedUser, contacts]);

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
        // You can store this for future use
        console.log('Conversation ID:', socketMessages.conversationId);
      }
    }
  }, [socketMessages, selectedUser]);

  // Auto-select first user when contacts are loaded and no user is selected
  useEffect(() => {
    if (contacts && contacts.length > 0 && !selectedUser) {
      const firstUser = contacts[0];
      const user: User = {
        id: String(firstUser.id),
        name: firstUser.name || firstUser.email || 'Unknown',
        avatar: firstUser.name ? firstUser.name.charAt(0).toUpperCase() : 'U',
        lastMessage: '',
        timestamp: '',
        isOnline: false,
        isGroup: false,
      };
      
      const mobileNo = firstUser.mobileNo || firstUser.number || '';
      handleSelectUser(user, mobileNo);
    }
  }, [contacts, selectedUser]);

  // Socket event listeners for real-time messaging
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const messageData = event.detail;
      
      if (messageData) {
        // Handle both nested and direct message structures
        const message = messageData.message || messageData;
        
        if (message && message.content) {
          const newMessage: Message = {
            id: message.id,
            sender: message.isOutgoing ? 'me' : 'them',
            content: message.content,
            timestamp: message.createdAt, // Don't format here, format during rendering
            type: 'text',
            isOutgoing: message.isOutgoing,
            messageType: message.messageType,
            createdAt: message.createdAt
          };

          // Add message to the appropriate conversation
          if (selectedUser) {
            const contact = contacts?.find(c => String(c.id) === selectedUser.id);
            const mobileNo = contact?.number || contact?.mobileNo || '';
            
            // Simplified relevance check - show all messages for the current conversation
            const isRelevantMessage = true; // Always show messages for the current conversation
            
            console.log('Message relevance check:', {
              messageMobileNo: message.mobileNo,
              contactMobileNo: mobileNo,
              isOutgoing: message.isOutgoing,
              type: messageData.type,
              isRelevant: isRelevantMessage
            });
            
            if (isRelevantMessage) {
              setMessages(prev => {
                const existingMessages = prev[selectedUser.id] || [];
                
                // Check if this is a real message replacing a temp message
                const tempMessageIndex = existingMessages.findIndex(msg => 
                  String(msg.id).startsWith('temp_') && 
                  msg.content === newMessage.content &&
                  msg.isOutgoing === newMessage.isOutgoing
                );
                
                if (tempMessageIndex !== -1) {
                  // Replace temp message with real message
                  const updatedMessages = [...existingMessages];
                  updatedMessages[tempMessageIndex] = newMessage;
                  return {
                    ...prev,
                    [selectedUser.id]: updatedMessages
                  };
                }
                
                // Check if message already exists (for incoming messages)
                const messageExists = existingMessages.some(msg => 
                  msg.id === newMessage.id || 
                  (msg.content === newMessage.content && 
                   msg.isOutgoing === newMessage.isOutgoing &&
                   Math.abs(new Date(msg.createdAt || '').getTime() - new Date(newMessage.createdAt || '').getTime()) < 5000)
                );
                
                if (!messageExists) {
                  return {
                    ...prev,
                    [selectedUser.id]: [...existingMessages, newMessage]
                  };
                } else {
                  return prev;
                }
              });
            } else {
              console.log('⚠️ Message not relevant to current conversation:', message.mobileNo, mobileNo);
            }
          }
        }
      }
    };

    const handleMessageSent = (event: CustomEvent) => {
      const sentData = event.detail;
      
      // Update the temporary message with the real message data
      if (selectedUser && sentData.message) {
        setMessages(prev => {
          const existingMessages = prev[selectedUser.id] || [];
          const updatedMessages = existingMessages.map(msg => {
            if (String(msg.id).startsWith('temp_') && msg.content === sentData.message.content) {
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
            !(String(m.id).startsWith('temp_') && m.content === errorData.message.content)
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
        return 'Invalid Date';
      }
      
      // Format as "DD-MM HH:MM AM/PM"
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      
      return `${day}-${month} ${displayHours}:${minutes} ${ampm}`;
    } catch (error: any) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
    }
  };

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedUser) return;

    const tempId = `temp_${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      content: message.trim(),
      sender: 'me',
      timestamp: new Date().toISOString(),
      type: 'text',
      isOutgoing: true,
      messageType: 'text',
      createdAt: new Date().toISOString()
    };

    // Add message to UI immediately (optimistic update)
    setMessages(prev => {
      const currentMessages = prev[selectedUser.id] || [];
      return {
        ...prev,
        [selectedUser.id]: [...currentMessages, newMessage]
      };
    });

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
        console.log('✅ Message sent successfully via API:', response.data);
        // The real message will be added via socket event, replacing the temp message
      } else {
        console.error('❌ Failed to send message:', response.data.error);
        // Remove the optimistic message on error
        setMessages(prev => {
          const currentMessages = prev[selectedUser.id] || [];
          return {
            ...prev,
            [selectedUser.id]: currentMessages.filter(m => m.id !== tempId)
          };
        });
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      // Remove the optimistic message on error
      setMessages(prev => {
        const currentMessages = prev[selectedUser.id] || [];;
        return {
          ...prev,
          [selectedUser.id]: currentMessages.filter(m => m.id !== tempId)
        };
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Ensure currentMessages is always an array and filter out undefined
  const currentMessages = selectedUser ? messages[selectedUser.id] || [] : [];
  // const currentMessages = selectedUser ? (messages[selectedUser.id] || []).filter(Boolean) : [];

  // Debug currentMessages
  if (currentMessages.length > 0) {
    console.log('🔍 First message:', currentMessages[0]);
    console.log('🔍 Last message:', currentMessages[currentMessages.length - 1]);
  } else if (selectedUser) {
    console.log('⚠️ No messages found for selected user:', selectedUser.id);
    console.log('⚠️ All messages in state:', messages);
  }

  // Update the contact click handler - use REST API to fetch messages
  const handleSelectUser = async (user: User, mobileNo: string) => {
    console.log('handleSelectUser called with:', { user, mobileNo });
    setSelectedUser(user);

    if (mobileNo) {
      const cleanMobileNo = mobileNo.replace(/^\+/, '').replace(/\s/g, '');
      
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

        if (response.data && response.data.status === 200) {
          // Get messages from the response - the messages are in data.messages
          const backendMessages = response.data.data.messages || [];
          
          if (backendMessages.length > 0) {
            const formattedMessages = backendMessages.map((msg: any) => {
              const isOutgoing = Boolean(msg.isOutgoing);
              
              return {
                id: msg.id,
                sender: isOutgoing ? 'me' : 'them',
                content: msg.content,
                timestamp: msg.createdAt,
                type: msg.messageType || 'text',
                isOutgoing: isOutgoing,
                messageType: msg.messageType,
                createdAt: msg.createdAt
              };
            });
            
            
            setMessages(prev => {
              const newState = {
                ...prev,
                [user.id]: formattedMessages
              };
              return newState;
            });
          } else {
            console.log('❌ No messages found in API response');
          }
        } else {
          console.log('❌ API response not successful:', response.data);
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
    <div className="flex h-full bg-neutral-50 font-sans overflow-hidden">
      {/* Left Panel - User List */}
      <div className="w-full md:w-1/3 bg-white border-r border-neutral-200 flex flex-col min-h-0">
        {/* Header */}
        <div className="bg-primary text-white p-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">WhatsApp</span>
          </div>
        </div>

        {/* Search Bar - Always visible */}
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

        {/* User List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                const contact = contacts?.find(c => String(c.id) === user.id);
                const mobileNo = contact?.number || contact?.mobileNo || '';
                handleSelectUser(user, mobileNo);
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-neutral-50 transition-colors ${
                selectedUser?.id === user.id ? 'bg-neutral-100' : ''
              }`}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-sm bg-neutral-200">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                {user.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-neutral text-sm truncate">{user.name}</h3>
                  <span className="text-xs text-neutral-400">{user.timestamp}</span>
                </div>
                <p className="text-xs text-neutral-400 truncate">{user.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-1 flex flex-col bg-neutral-50 min-h-0">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-neutral-200 p-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-sm bg-neutral-200">
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
            </div>

            {/* Chat Messages - Scrollable */}
            <div 
              className="flex-1 overflow-y-auto min-h-0 bg-white"
              style={{ 
                backgroundImage: 'radial-gradient(circle at 25% 25%, #f0f0f0 1px, transparent 1px), radial-gradient(circle at 75% 75%, #f0f0f0 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >
              <div className="p-4 pb-2">
                {currentMessages.length === 0 ? (
                  <div className="text-center text-neutral-400 text-sm py-8">
                    No messages yet. Start a conversation!
                  </div>
                ) : (
                  currentMessages.map((msg, index) => {
                    const isOutgoing = Boolean(msg.isOutgoing);
                    console .log(`Rendering message ${index + 1}/${currentMessages.length}:`, msg.id, 'isOutgoing:', isOutgoing);
                    
                    return (
                      <div key={msg.id} className={`mb-4 ${isOutgoing ? 'text-right' : 'text-left'}`}>
                        <div
                          className={`inline-block max-w-[85%] md:max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            isOutgoing
                              ? 'bg-primary text-white rounded-br-md'
                              : 'bg-white text-neutral-800 rounded-bl-md border border-neutral-200'
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
                          <p className={`text-sm break-words leading-relaxed ${isOutgoing ? 'text-white' : 'text-neutral-800'}`}>{msg.content}</p>
                          <p className={`text-xs mt-2 opacity-70 ${isOutgoing ? 'text-white' : ''}`}>
                            {formatTimestamp(msg.timestamp || msg.createdAt || '')}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input - Fixed at bottom */}
            <div className="bg-white border-t border-neutral-200 p-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message"
                    className="pr-20 text-sm h-10 rounded-full"
                  />
                </div>
                {message.trim() ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary h-8 w-8"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <IconSend className="h-4 w-4" />
                  </Button>
                ) : (
                  null
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-medium text-neutral mb-2">Select a chat</h3>
              <p className="text-sm text-neutral-400">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppChat; 
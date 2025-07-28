import { useEffect, useCallback, useState } from 'react';
import { useSocket } from '@/providers/socket-provider';

interface WhatsAppMessage {
  id: string;
  content: string;
  isOutgoing: boolean;
  messageType: string;
  createdAt: string;
  conversationId?: string;
  sender?: {
    id: string;
    mobileNo?: string;
  };
}

interface WhatsAppConnectionStatus {
  connected: boolean;
  connectionState: string;
  lastConnectedAt?: string;
  qrCode?: string;
  userId: string;
}

export const useWhatsAppSocket = () => {
  const { isConnected, isAuthenticated, sendMessage, joinConversation, leaveConversation, getConnectionStatus, getContacts, getMessagesBetween, getQrCode } = useSocket();
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus | null>(null);
  const [lastMessage, setLastMessage] = useState<WhatsAppMessage | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [contacts, setContacts] = useState<any[]>([]);
  const [messages, setMessages] = useState<any>(null);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle socket events
  useEffect(() => {
    const handleNewMessage = (event: CustomEvent) => {
      const message: WhatsAppMessage = event.detail;
      setLastMessage(message);
      setLastError(null);
    };

    const handleMessageSentSuccess = (event: CustomEvent) => {
      const result = event.detail;
      console.log('Message sent successfully:', result);
      setLastError(null);
    };

    const handleMessageSendError = (event: CustomEvent) => {
      const error = event.detail;
      setLastError(error.error || 'Failed to send message');
      console.error('Message send error:', error);
    };

    const handleStatusUpdate = (event: CustomEvent) => {
      const status: WhatsAppConnectionStatus = event.detail;
      setConnectionStatus(status);
    };

    const handleConnectionStatus = (event: CustomEvent) => {
      const status: WhatsAppConnectionStatus = event.detail;
      setConnectionStatus(status);
    };

    const handleContactsResponse = (event: CustomEvent) => {
      const response = event.detail;
      setIsLoading(false);
      if (response.success) {
        setContacts(response.data);
        setLastError(null);
      } else {
        setLastError(response.error || 'Failed to fetch contacts');
      }
    };

    const handleMessagesBetweenResponse = (event: CustomEvent) => {
      const response = event.detail;
      setIsLoading(false);
      if (response.success) {
        setMessages(response.data);
        setLastError(null);
      } else {
        setLastError(response.error || 'Failed to fetch messages');
      }
    };

    const handleQrCodeResponse = (event: CustomEvent) => {
      const response = event.detail;
      setIsLoading(false);
      if (response.success) {
        setQrCodeData(response.data);
        setLastError(null);
      } else {
        setLastError(response.error || 'Failed to get QR code');
      }
    };

    // Add event listeners
    window.addEventListener('whatsapp:new_message', handleNewMessage as EventListener);
    window.addEventListener('whatsapp:message_sent_success', handleMessageSentSuccess as EventListener);
    window.addEventListener('whatsapp:message_send_error', handleMessageSendError as EventListener);
    window.addEventListener('whatsapp:status_update', handleStatusUpdate as EventListener);
    window.addEventListener('whatsapp:connection_status', handleConnectionStatus as EventListener);
    window.addEventListener('whatsapp:contacts_response', handleContactsResponse as EventListener);
    window.addEventListener('whatsapp:messages_between_response', handleMessagesBetweenResponse as EventListener);
    window.addEventListener('whatsapp:qr_code_response', handleQrCodeResponse as EventListener);

    return () => {
      // Clean up event listeners
      window.removeEventListener('whatsapp:new_message', handleNewMessage as EventListener);
      window.removeEventListener('whatsapp:message_sent_success', handleMessageSentSuccess as EventListener);
      window.removeEventListener('whatsapp:message_send_error', handleMessageSendError as EventListener);
      window.removeEventListener('whatsapp:status_update', handleStatusUpdate as EventListener);
      window.removeEventListener('whatsapp:connection_status', handleConnectionStatus as EventListener);
      window.removeEventListener('whatsapp:contacts_response', handleContactsResponse as EventListener);
      window.removeEventListener('whatsapp:messages_between_response', handleMessagesBetweenResponse as EventListener);
      window.removeEventListener('whatsapp:qr_code_response', handleQrCodeResponse as EventListener);
    };
  }, []);

  // Send WhatsApp message via socket
  const sendWhatsAppMessage = useCallback((to: string, message: string, conversationId?: string) => {
    if (!isConnected || !isAuthenticated) {
      setLastError('Socket not connected or not authenticated');
      return false;
    }

    try {
      sendMessage(to, message, conversationId);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      setLastError('Failed to send message');
      return false;
    }
  }, [isConnected, isAuthenticated, sendMessage]);

  // Join conversation room
  const joinWhatsAppConversation = useCallback((conversationId: string) => {
    if (isConnected && isAuthenticated) {
      joinConversation(conversationId);
      return true;
    }
    return false;
  }, [isConnected, isAuthenticated, joinConversation]);

  // Leave conversation room
  const leaveWhatsAppConversation = useCallback((conversationId: string) => {
    if (isConnected && isAuthenticated) {
      leaveConversation(conversationId);
      return true;
    }
    return false;
  }, [isConnected, isAuthenticated, leaveConversation]);

  // Request current connection status
  const requestConnectionStatus = useCallback(() => {
    if (isConnected && isAuthenticated) {
      getConnectionStatus();
      return true;
    }
    return false;
  }, [isConnected, isAuthenticated, getConnectionStatus]);

  // Fetch contacts via socket
  const fetchContacts = useCallback(() => {
    if (isConnected && isAuthenticated) {
      setIsLoading(true);
      getContacts();
      return true;
    }
    setLastError('Socket not connected or not authenticated');
    return false;
  }, [isConnected, isAuthenticated, getContacts]);

  // Fetch messages between numbers via socket
  const fetchMessagesBetween = useCallback((fromNumber: string, toNumber: string, limit = 50, offset = 0) => {
    if (isConnected && isAuthenticated) {
      setIsLoading(true);
      getMessagesBetween(fromNumber, toNumber, limit, offset);
      return true;
    }
    setLastError('Socket not connected or not authenticated');
    return false;
  }, [isConnected, isAuthenticated, getMessagesBetween]);

  // Fetch QR code via socket
  const fetchQrCode = useCallback((forceNew = false) => {
    if (isConnected) {
      setIsLoading(true)
      setLastError(null)
      getQrCode(forceNew)
      return true
    }
    setLastError('Socket not connected')
    return false
  }, [isConnected, getQrCode])

  // Clear error
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  // Clear data
  const clearData = useCallback(() => {
    setContacts([]);
    setMessages(null);
    setQrCodeData(null);
    setLastError(null);
  }, []);

  return {
    // Connection state
    isSocketConnected: isConnected,
    isSocketAuthenticated: isAuthenticated,
    connectionStatus,
    
    // Message handling
    lastMessage,
    lastError,
    
    // Data state
    contacts,
    messages,
    qrCodeData,
    isLoading,
    
    // Actions
    sendWhatsAppMessage,
    joinWhatsAppConversation,
    leaveWhatsAppConversation,
    requestConnectionStatus,
    fetchContacts,
    fetchMessagesBetween,
    fetchQrCode,
    clearError,
    clearData,
    
    // Status helpers
    isWhatsAppConnected: connectionStatus?.connected || false,
    whatsAppConnectionState: connectionStatus?.connectionState || 'unknown'
  };
};

export default useWhatsAppSocket; 
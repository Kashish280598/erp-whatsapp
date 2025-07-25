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
  const { isConnected, isAuthenticated, sendMessage, joinConversation, leaveConversation, getConnectionStatus } = useSocket();
  const [connectionStatus, setConnectionStatus] = useState<WhatsAppConnectionStatus | null>(null);
  const [lastMessage, setLastMessage] = useState<WhatsAppMessage | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

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

    // Add event listeners
    window.addEventListener('whatsapp:new_message', handleNewMessage as EventListener);
    window.addEventListener('whatsapp:message_sent_success', handleMessageSentSuccess as EventListener);
    window.addEventListener('whatsapp:message_send_error', handleMessageSendError as EventListener);
    window.addEventListener('whatsapp:status_update', handleStatusUpdate as EventListener);
    window.addEventListener('whatsapp:connection_status', handleConnectionStatus as EventListener);

    return () => {
      // Clean up event listeners
      window.removeEventListener('whatsapp:new_message', handleNewMessage as EventListener);
      window.removeEventListener('whatsapp:message_sent_success', handleMessageSentSuccess as EventListener);
      window.removeEventListener('whatsapp:message_send_error', handleMessageSendError as EventListener);
      window.removeEventListener('whatsapp:status_update', handleStatusUpdate as EventListener);
      window.removeEventListener('whatsapp:connection_status', handleConnectionStatus as EventListener);
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

  // Clear error
  const clearError = useCallback(() => {
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
    
    // Actions
    sendWhatsAppMessage,
    joinWhatsAppConversation,
    leaveWhatsAppConversation,
    requestConnectionStatus,
    clearError,
    
    // Status helpers
    isWhatsAppConnected: connectionStatus?.connected || false,
    whatsAppConnectionState: connectionStatus?.connectionState || 'unknown'
  };
};

export default useWhatsAppSocket; 
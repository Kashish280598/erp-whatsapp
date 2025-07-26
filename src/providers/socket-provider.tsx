
import type { RootState } from '@/lib/store'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import io, { Socket } from 'socket.io-client'
import { API_CONFIG } from '@/lib/api/config'
import Cookies from 'js-cookie'

interface SocketContextType {
    socket: Socket | null
    isConnected: boolean
    isAuthenticated: boolean
    sendMessage: (to: string, message: string, conversationId?: string) => void
    joinConversation: (conversationId: string) => void
    leaveConversation: (conversationId: string) => void
    getConnectionStatus: () => void
    getContacts: () => void
    getMessagesBetween: (fromNumber: string, toNumber: string, limit?: number, offset?: number) => void
    getQrCode: (forceNew?: boolean) => void
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    isAuthenticated: false,
    sendMessage: () => {},
    joinConversation: () => {},
    leaveConversation: () => {},
    getConnectionStatus: () => {},
    getContacts: () => {},
    getMessagesBetween: () => {},
    getQrCode: () => {}
})

export const useSocket = () => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}

export const SocketProvider = ({ children }: any) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const user = useSelector((state: RootState) => state.auth.user)
    const appAuthToken = useSelector((state: RootState) => state.auth.token)
    const isAppAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)

    // Get token from Redux store or cookies as fallback
    const getAuthToken = useCallback(() => {
        return appAuthToken || Cookies.get('erp_token') || localStorage.getItem('auth_token')
    }, [appAuthToken])

    // Socket event handlers setup
    const setupSocketListeners = useCallback((socketInstance: Socket) => {
        socketInstance.on('connect', () => {
            console.log('✅ Socket connected:', socketInstance.id)
            setIsConnected(true)
            
            // Authenticate with token
            const token = getAuthToken()
            if (token) {
                console.log('🔐 Authenticating socket with token')
                // The token is already sent in the handshake, so we don't need to emit authenticate
                // The backend middleware will handle authentication automatically
                setIsAuthenticated(true)
            } else {
                console.log('⚠️ No token available for socket authentication')
                setIsAuthenticated(false)
            }
        })

        socketInstance.on('disconnect', () => {
            console.log('❌ Socket disconnected')
            setIsConnected(false)
            setIsAuthenticated(false)
        })

        socketInstance.on('authenticated', (data) => {
            console.log('✅ Socket authenticated successfully:', data)
            setIsAuthenticated(true)
        })

        socketInstance.on('auth_error', (error) => {
            console.error('❌ Socket authentication error:', error)
            setIsAuthenticated(false)
        })

        socketInstance.on('error', (error) => {
            console.error('❌ Socket error:', error)
            // Don't treat all socket errors as auth errors
            if (error?.message?.includes('authenticated') || error?.message?.includes('auth')) {
                setIsAuthenticated(false)
            }
        })

        // Real-time message events
        socketInstance.on('new_message', (data) => {
            console.log('📨 New message received via socket:', data)
            
            // Dispatch custom event for components to listen to
            const event = new CustomEvent('new_message', { detail: data })
            window.dispatchEvent(event)
        })

        socketInstance.on('message_sent', (data) => {
            console.log('✅ Message sent confirmation via socket:', data)
            
            // Dispatch custom event for components to listen to
            const event = new CustomEvent('message_sent', { detail: data })
            window.dispatchEvent(event)
        })

        socketInstance.on('message_error', (data) => {
            console.error('❌ Message error via socket:', data)
            
            // Dispatch custom event for components to listen to
            const event = new CustomEvent('message_error', { detail: data })
            window.dispatchEvent(event)
        })

        // WhatsApp specific events
        socketInstance.on('message_sent_success', (result) => {
            console.log('Message sent successfully:', result)
            window.dispatchEvent(new CustomEvent('whatsapp:message_sent_success', { detail: result }))
        })

        socketInstance.on('message_send_error', (error) => {
            console.error('Message send error:', error)
            window.dispatchEvent(new CustomEvent('whatsapp:message_send_error', { detail: error }))
        })

        socketInstance.on('whatsapp_status_update', (status) => {
            console.log('WhatsApp status update:', status)
            window.dispatchEvent(new CustomEvent('whatsapp:status_update', { detail: status }))
        })

        socketInstance.on('connection_status', (status) => {
            console.log('Connection status:', status)
            window.dispatchEvent(new CustomEvent('whatsapp:connection_status', { detail: status }))
        })

        socketInstance.on('joined_conversation', (data) => {
            console.log('Joined conversation:', data)
        })

        socketInstance.on('left_conversation', (data) => {
            console.log('Left conversation:', data)
        })

        // Handle contacts response
        socketInstance.on('contacts_response', (response) => {
            console.log('Contacts response:', response)
            window.dispatchEvent(new CustomEvent('whatsapp:contacts_response', { detail: response }))
        })

        // Handle messages between response
        socketInstance.on('messages_between_response', (response) => {
            console.log('Messages between response:', response)
            window.dispatchEvent(new CustomEvent('whatsapp:messages_between_response', { detail: response }))
        })

        // Handle QR code response
        socketInstance.on('qr_code_response', (response) => {
            console.log('QR code response:', response)
            window.dispatchEvent(new CustomEvent('whatsapp:qr_code_response', { detail: response }))
        })
    }, [user, getAuthToken])

    useEffect(() => {
        // Get authentication token
        const token = getAuthToken();
        console.log('🔌 Connecting socket with token:', token ? 'Present' : 'Missing');
        if (token) {
            console.log('🔍 Token preview:', token.substring(0, 50) + '...');
        }

        // Don't reconnect if socket is already connected and authenticated
        if (socket && isConnected && isAuthenticated) {
            console.log('Socket already connected and authenticated, skipping reconnect')
            return
        }

        // Determine socket URL based on environment
        const socketUrl = API_CONFIG.socketURL
        
        console.log('Connecting to socket:', socketUrl)
        
        const socketInstance = io(socketUrl, {
            path: '/socket.io',
            forceNew: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
            transports: ['websocket', 'polling'],
            autoConnect: true,
            upgrade: true,
            // Add authentication data
            auth: {
                token: token
            },
            query: {
                token: token
            }
        })

        setupSocketListeners(socketInstance)
        setSocket(socketInstance)

        return () => {
            console.log('Cleaning up socket connection')
            socketInstance.disconnect()
            setSocket(null)
            setIsConnected(false)
            setIsAuthenticated(false)
        }
    }, [isAppAuthenticated, setupSocketListeners, getAuthToken])

    // Helper functions
    const sendMessage = useCallback((to: string, message: string, conversationId?: string) => {
        if (socket && isConnected) {
            socket.emit('send_message', {
                to,
                message,
                conversationId
            })
        } else {
            console.warn('Socket not connected')
        }
    }, [socket, isConnected])

    const joinConversation = useCallback((conversationId: string) => {
        if (socket && isConnected) {
            socket.emit('join_conversation', { conversationId })
        }
    }, [socket, isConnected])

    const leaveConversation = useCallback((conversationId: string) => {
        if (socket && isConnected) {
            socket.emit('leave_conversation', { conversationId })
        }
    }, [socket, isConnected])

    const getConnectionStatus = useCallback(() => {
        if (socket && isConnected) {
            socket.emit('get_connection_status')
        }
    }, [socket, isConnected])

    const getContacts = useCallback(() => {
        if (socket && isConnected) {
            socket.emit('get_contacts')
        } else {
            console.warn('Socket not connected')
        }
    }, [socket, isConnected])

    const getMessagesBetween = useCallback((fromNumber: string, toNumber: string, limit = 50, offset = 0) => {
        if (socket && isConnected) {
            socket.emit('get_messages_between', {
                fromNumber,
                toNumber,
                limit,
                offset
            })
        } else {
            console.warn('Socket not connected')
        }
    }, [socket, isConnected])

    const getQrCode = useCallback((forceNew = false) => {
        console.log(socket, isConnected, ">>>>>>>>/////////")
        if (socket && isConnected) {
            socket.emit('get_qr_code', { forceNew })
        } else {
            console.warn('Socket not connected - cannot request QR code')
        }
    }, [socket, isConnected])

    const contextValue: SocketContextType = {
        socket,
        isConnected,
        isAuthenticated,
        sendMessage,
        joinConversation,
        leaveConversation,
        getConnectionStatus,
        getContacts,
        getMessagesBetween,
        getQrCode
    }

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    )

}
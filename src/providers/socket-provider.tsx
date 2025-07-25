
import type { RootState } from '@/lib/store'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import io, { Socket } from 'socket.io-client'
import { API_CONFIG } from '@/lib/api/config'

interface SocketContextType {
    socket: Socket | null
    isConnected: boolean
    isAuthenticated: boolean
    sendMessage: (to: string, message: string, conversationId?: string) => void
    joinConversation: (conversationId: string) => void
    leaveConversation: (conversationId: string) => void
    getConnectionStatus: () => void
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
    isAuthenticated: false,
    sendMessage: () => {},
    joinConversation: () => {},
    leaveConversation: () => {},
    getConnectionStatus: () => {}
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
    const token = useSelector((state: RootState) => state.auth.token)

    // Socket event handlers setup
    const setupSocketListeners = useCallback((socketInstance: Socket) => {
        socketInstance.on('connect', () => {
            console.log('Socket connected:', socketInstance.id)
            setIsConnected(true)
            
            // Authenticate with the server
            if (user && token) {
                socketInstance.emit('authenticate', {
                    token,
                    userId: user.id.toString()
                })
            }
        })

        socketInstance.on('disconnect', () => {
            console.log('Socket disconnected')
            setIsConnected(false)
            setIsAuthenticated(false)
        })

        socketInstance.on('authenticated', (data) => {
            console.log('Socket authenticated:', data)
            setIsAuthenticated(true)
        })

        socketInstance.on('auth_error', (error) => {
            console.error('Socket authentication error:', error)
            setIsAuthenticated(false)
        })

        socketInstance.on('error', (error) => {
            console.error('Socket error:', error)
        })

        // WhatsApp specific events
        socketInstance.on('new_message', (message) => {
            console.log('New message received:', message)
            // Emit custom event for components to listen
            window.dispatchEvent(new CustomEvent('whatsapp:new_message', { detail: message }))
        })

        socketInstance.on('message_sent', (message) => {
            console.log('Message sent confirmation:', message)
            window.dispatchEvent(new CustomEvent('whatsapp:message_sent', { detail: message }))
        })

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
    }, [user, token])

    useEffect(() => {
        if (!user || !token) {
            if (socket) {
                socket.disconnect()
                setSocket(null)
                setIsConnected(false)
                setIsAuthenticated(false)
            }
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
            upgrade: true
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
    }, [user, token, setupSocketListeners])

    // Helper functions
    const sendMessage = useCallback((to: string, message: string, conversationId?: string) => {
        if (socket && isAuthenticated) {
            socket.emit('send_message', {
                to,
                message,
                conversationId
            })
        } else {
            console.warn('Socket not connected or not authenticated')
        }
    }, [socket, isAuthenticated])

    const joinConversation = useCallback((conversationId: string) => {
        if (socket && isAuthenticated) {
            socket.emit('join_conversation', { conversationId })
        }
    }, [socket, isAuthenticated])

    const leaveConversation = useCallback((conversationId: string) => {
        if (socket && isAuthenticated) {
            socket.emit('leave_conversation', { conversationId })
        }
    }, [socket, isAuthenticated])

    const getConnectionStatus = useCallback(() => {
        if (socket && isAuthenticated) {
            socket.emit('get_connection_status')
        }
    }, [socket, isAuthenticated])

    const contextValue: SocketContextType = {
        socket,
        isConnected,
        isAuthenticated,
        sendMessage,
        joinConversation,
        leaveConversation,
        getConnectionStatus
    }

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    )
}
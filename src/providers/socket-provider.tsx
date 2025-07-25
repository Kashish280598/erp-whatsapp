
import type { RootState } from '@/lib/store'
import { createContext, useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import io, { Socket } from 'socket.io-client'

const SocketContext = createContext<{ socket: Socket | null, isConnected: boolean }>({ socket: null, isConnected: false })

export const useSocket = () => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context
}

export const SocketProvider = ({ children }: any) => {
    const [socket, setSocket] = useState(null)
    const [isConnected, setIsConnected] = useState(false)
    const user = useSelector((state: RootState) => state.auth.user)



    useEffect(() => {
        if (!user) return
        const socketInstance = io(process.env.REACT_APP_SOCKET_URL, {
            query: {
                userId: user?.id,
            },
            forceNew: true,
            path: process.env.REACT_APP_ENV === 'production' ? '/socket.io' : '/api/socket.io',
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000,
        })
        socketInstance.on('connect', () => {
            setIsConnected(true)
        })
        socketInstance.on('disconnect', () => {
            setIsConnected(false)
        })
        // @ts-ignore
        setSocket(socketInstance)
        return () => {
            socketInstance.disconnect()
        }
    }, [user])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
    )
}
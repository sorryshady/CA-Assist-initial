// useSocket.js
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.REACT_APP_SOCKET_URL

export const useSocket = () => {
  const [socketIOClientId, setSocketIOClientId] = useState('')

  useEffect(() => {
    const socket = io(SOCKET_URL)
    socket.on('connect', () => {
      setSocketIOClientId(socket.id)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return { socketIOClientId }
}

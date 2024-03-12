import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
const SOCKET_URL = import.meta.env.REACT_APP_SOCKET_URL

export const useSocket = () => {
  const [socketIOClientId, setSocketIOClientId] = useState('')
  const [tokens, setTokens] = useState('')

  useEffect(() => {
    const socket = io(SOCKET_URL)
    socket.on('connect', () => {
      setTokens('')
      setSocketIOClientId(socket.id)
    })
    socket.on('start', () => {
      console.log('start')
    })
    socket.on('token', (token) => {
      // console.log(token)
      setTokens((prevValue) => prevValue + token)
    })
    socket.on('end', () => {
      // setTokens('')
      console.log('end')
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  return {
    socketIOClientId,
    tokens,
    setTokens,
  }
}

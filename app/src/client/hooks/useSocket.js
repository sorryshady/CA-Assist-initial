import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { getWithExpiry } from '../utils/localstorage-expiry'
const SOCKET_URL = import.meta.env.REACT_APP_SOCKET_URL

export const useSocket = () => {
  const socketId = getWithExpiry('aiChat').socketId
  const [socketIOClientId, setSocketIOClientId] = useState(socketId || '')
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

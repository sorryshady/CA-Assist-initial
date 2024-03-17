import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const chatId = localStorage.getItem('caChatId')
// const CA_SOCKET_URL = `ws://localhost:3000/ws?chat_id=${chatId}`
const WS_BASE_URL = 'ws://localhost:3000/ws'
export const useCaChat = () => {
  const [message, setMessage] = useState('')
  useEffect(() => {
    // Construct the WebSocket URL with the chat_id parameter
    const wsUrl = `${WS_BASE_URL}?chat_id=${chatId}`

    // Create a new WebSocket connection
    const socket = new WebSocket(wsUrl)

    // Event listener for when the WebSocket connection is open
    socket.onopen = () => {
      console.log('WebSocket connection opened')
    }

    // Event listener for receiving messages from the WebSocket server
    socket.addEventListener('message', (event) => {
      console.log('Message from server ', event.data)
    })

    // Event listener for WebSocket errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    // Event listener for when the WebSocket connection is closed
    socket.onclose = () => {
      console.log('WebSocket connection closed')
    }

    // Clean up function to close the WebSocket connection when component unmounts
    return () => {
      socket.close()
    }
  }, [chatId])

  return { message }
}

import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useTelegramApi } from './useTelegramApi'
// import WebSocket from 'ws'

const chatId = localStorage.getItem('caChatId')
const WS_BASE_URL = 'ws://localhost:3000/ws'
const wsUrl = `${WS_BASE_URL}?chat_id=${chatId}`
export const useCaChat = () => {
  const [message, setMessage] = useState('')
  useEffect(() => {
    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      console.log('Socket connection established')
    }
    socket.onmessage = (event) => {
      const response = JSON.parse(event.data)
      if (response.type === 'message') {
        const messageBody = {
          type: 'caMessage',
          message: response.content,
          timeStamp: Date.now(),
        }
        setMessage(messageBody)
      } else if (response.type === 'file') {
        const fileURL = response.content
        const lastIndex = fileURL.lastIndexOf('/')
        const name = fileURL.substring(lastIndex + 1)
        const lastDot = name.lastIndexOf('.')
        const type = name.substring(lastDot + 1)
        console.log(name, type)
        const saveFile = {
          name,
          type,
        }
        const messageBody = {
          type: 'caMessage',
          fileData: saveFile,
          timeStamp: Date.now(),
        }
        setMessage(messageBody)
      }
    }
    socket.onclose = () => {
      console.log('Socket connection closed')
    }

    socket.onerror = (error) => {
      console.log('Socket connection error: ', error)
    }
  }, [chatId])

  return { message }
}

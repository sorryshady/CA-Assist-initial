import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Description } from '@radix-ui/react-dialog'
const connectedState = localStorage.getItem('connected')
export const useCaChat = () => {
  const { toast } = useToast()
  const [message, setMessage] = useState('')
  const [connected, setConnected] = useState(connectedState === 'true')

  useEffect(() => {
    let socket = null

    const createSocket = () => {
      const chatId = localStorage.getItem('caChatId')
      if (socket !== null) return // Don't recreate socket if it already exists

      const wsUrl = `ws://localhost:3000/ws?chat_id=${chatId}`
      // console.log(wsUrl)
      if (chatId !== null) {
        socket = new WebSocket(wsUrl)

        socket.onopen = () => {
          console.log('Socket connection established')
          toast({ title: 'Succesfully connected with a Chartered Accountant.' })
          localStorage.setItem('connected', true)
          setConnected(true)
        }

        socket.onmessage = (event) => {
          const response = JSON.parse(event.data)
          if (response.type === 'message') {
            const messageBody = {
              type: 'caMessage',
              message: response.content,
              timeStamp: Date.now(),
            }
            if (response.content === '') return
            else setMessage(messageBody)
          } else if (response.type === 'file') {
            const fileURL = response.content
            const lastIndex = fileURL.lastIndexOf('/')
            const name = fileURL.substring(lastIndex + 1)
            const lastDot = name.lastIndexOf('.')
            const type = name.substring(lastDot)
            console.log(name, type)
            const saveFile = {
              name,
              type,
              url: fileURL,
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
          localStorage.setItem('connected', false)
          setConnected(false)
          socket = null // Reset socket to null so it can be recreated on next interval
        }

        socket.onerror = (error) => {
          console.log('Socket connection error: ', error)
          localStorage.setItem('connected', false)
          setConnected(false)
          socket = null // Reset socket to null so it can be recreated on next interval
        }
      }
      // Call createSocket initially
      createSocket()
    }
    // Set interval to recreate socket every 10 seconds
    const interval = setInterval(() => {
      createSocket()
    }, 5000)

    // Cleanup function to clear interval
    return () => {
      clearInterval(interval)
      if (socket) socket.close()
      console.log('closing socket')
    }
  }, []) // No dependencies, so this effect runs only once

  return { message }
}

// import { useState, useEffect } from 'react'
// // import WebSocket from 'ws'

// const chatId = localStorage.getItem('caChatId')
// const WS_BASE_URL = 'ws://localhost:3000/ws'
// const wsUrl = `${WS_BASE_URL}?chat_id=${chatId}`
// export const useCaChat = () => {
//   const [message, setMessage] = useState('')
//   useEffect(() => {
//     const socket = new WebSocket(wsUrl)

//     socket.onopen = () => {
//       console.log('Socket connection established')
//     }
//     socket.onmessage = (event) => {
//       const response = JSON.parse(event.data)
//       if (response.type === 'message') {
//         const messageBody = {
//           type: 'caMessage',
//           message: response.content,
//           timeStamp: Date.now(),
//         }
//         if (response.content === '') return
//         else setMessage(messageBody)
//       } else if (response.type === 'file') {
//         const fileURL = response.content
//         const lastIndex = fileURL.lastIndexOf('/')
//         const name = fileURL.substring(lastIndex + 1)
//         const lastDot = name.lastIndexOf('.')
//         const type = name.substring(lastDot)
//         console.log(name, type)
//         const saveFile = {
//           name,
//           type,
//           url: fileURL,
//         }
//         const messageBody = {
//           type: 'caMessage',
//           fileData: saveFile,
//           timeStamp: Date.now(),
//         }
//         setMessage(messageBody)
//       }
//     }
//     socket.onclose = () => {
//       console.log('Socket connection closed')
//     }

//     socket.onerror = (error) => {
//       console.log('Socket connection error: ', error)
//     }
//   }, [chatId])

//   return { message }
// }
import { useState, useEffect, useRef } from 'react'

const WS_BASE_URL = 'ws://localhost:3000/ws'

export const useCaChat = () => {
  const [message, setMessage] = useState('')
  const socket = useRef(null)

  useEffect(() => {
    const chatId = localStorage.getItem('caChatId')
    if (!chatId) {
      return
    }

    const wsUrl = `${WS_BASE_URL}?chat_id=${chatId}`
    const isConnected = () => localStorage.getItem('connected') === 'true'

    const connectWebSocket = () => {
      if (!isConnected()) {
        socket.current = new WebSocket(wsUrl)
        socket.current.onopen = () => {
          console.log('Socket connection established')
          localStorage.setItem('connected', true)
        }
        socket.current.onclose = () => {
          localStorage.setItem('connected', false)
          console.log('Socket connection closed')
        }
        socket.current.onerror = (error) => {
          localStorage.setItem('connected', false)
          console.log('Socket connection error: ', error)
        }
        socket.current.onmessage = (event) => {
          const response = JSON.parse(event.data)
          handleIncomingMessage(response)
        }
      }
    }

    const handleIncomingMessage = (response) => {
      if (response.type === 'message' && response.content !== '') {
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

    connectWebSocket()

    // Cleanup on unmount or chatId change
    return () => {
      if (socket.current) {
        socket.current.close()
        localStorage.setItem('connected', false)
      }
    }
  }, []) // Dependencies array is empty to mimic componentDidMount behavior

  return { message }
}

// import { useState, useEffect, useRef } from 'react'
// import { useToast } from '@/components/ui/use-toast'
// import { Description } from '@radix-ui/react-dialog'
// const connectedState = localStorage.getItem('connected')
// export const useCaChat = () => {
//   const { toast } = useToast()
//   const [message, setMessage] = useState('')
//   const [connected, setConnected] = useState(connectedState === 'true')
//   const immediatelyClosed = useRef(null)
//   useEffect(() => {
//     immediatelyClosed.current = false
//     let socket = null

//     const createSocket = () => {
//       const chatId = localStorage.getItem('caChatId')
//       if (socket !== null) return // Don't recreate socket if it already exists

//       const wsUrl = `ws://localhost:3000/ws?chat_id=${chatId}`

//       if (chatId !== null) {
//         socket = new WebSocket(wsUrl)
//         socket.onopen = () => {
//           immediatelyClosed.current = false
//           console.log('Socket connection established')
//           setTimeout(() => {
//             if (!immediatelyClosed.current)
//               toast({
//                 title: 'Succesfully connected with a Chartered Accountant.',
//               })
//           }, 500)
//           localStorage.setItem('connected', true)
//           setConnected(true)
//         }

//         socket.onmessage = (event) => {
//           const response = JSON.parse(event.data)
//           if (response.type === 'message') {
//             const messageBody = {
//               type: 'caMessage',
//               message: response.content,
//               timeStamp: Date.now(),
//             }
//             if (response.content === '') return
//             else setMessage(messageBody)
//           } else if (response.type === 'file') {
//             const fileURL = response.content
//             const lastIndex = fileURL.lastIndexOf('/')
//             const name = fileURL.substring(lastIndex + 1)
//             const lastDot = name.lastIndexOf('.')
//             const type = name.substring(lastDot)
//             const saveFile = {
//               name,
//               type,
//               url: fileURL,
//             }
//             const messageBody = {
//               type: 'caMessage',
//               fileData: saveFile,
//               timeStamp: Date.now(),
//             }
//             setMessage(messageBody)
//           }
//         }

//         socket.onclose = () => {
//           immediatelyClosed.current = true
//           console.log('Socket connection closed.')
//           localStorage.setItem('connected', false)
//           setConnected(false)
//           socket = null // Reset socket to null so it can be recreated on next interval
//         }

//         socket.onerror = (error) => {
//           console.log('Socket connection error: ', error)
//           localStorage.setItem('connected', false)
//           setConnected(false)
//           socket = null // Reset socket to null so it can be recreated on next interval
//         }
//       }
//       // Call createSocket initially
//       createSocket()
//     }
//     // Set interval to recreate socket every 10 seconds
//     const interval = setInterval(() => {
//       if (localStorage.getItem('chatType') !== 'ca') return
//       createSocket()
//     }, 5000)

//     // Cleanup function to clear interval
//     return () => {
//       clearInterval(interval)
//     }
//   }, []) // No dependencies, so this effect runs only once

//   return { message }
// }
import { useState, useEffect, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'

export const useCaChat = () => {
  const { toast } = useToast()
  const [message, setMessage] = useState('')
  const [connected, setConnected] = useState(false) // Change initial state to false
  const immediatelyClosed = useRef(null)

  useEffect(() => {
    immediatelyClosed.current = false
    let socket = null

    const createSocket = () => {
      const chatId = localStorage.getItem('caChatId')
      if (socket !== null) return // Don't recreate socket if it already exists

      const wsUrl = `ws://localhost:3000/ws?chat_id=${chatId}`

      if (chatId !== null) {
        socket = new WebSocket(wsUrl)
        socket.onopen = () => {
          immediatelyClosed.current = false
          console.log('Socket connection established')
          setTimeout(() => {
            if (!immediatelyClosed.current)
              toast({
                title: 'Succesfully connected with a Chartered Accountant.',
              })
          }, 500)
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
          } else if (response.type === 'voice') {
            const url = response.content
            const messageBody = {
              type: 'caMessage',
              voiceFileUrl: url,
              timeStamp: Date.now(),
            }
            setMessage(messageBody)
          } 
        }

        socket.onclose = () => {
          immediatelyClosed.current = true
          console.log('Socket connection closed.')
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
    }

    // Call createSocket initially
    createSocket()

    // Set interval to recreate socket every 10 seconds
    const interval = setInterval(() => {
      if (localStorage.getItem('chatType') !== 'ca') return
      createSocket()
    }, 5000)

    // Cleanup function to clear interval
    return () => {
      clearInterval(interval)
    }
  }, []) // No dependencies, so this effect runs only once

  return { message }
}

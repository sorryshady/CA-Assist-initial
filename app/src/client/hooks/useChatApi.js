import { useState, useEffect } from 'react'
import { setWithExpiry, getWithExpiry } from '../utils/localstorage-expiry'
import { useSocket } from './useSocket'
const CHATBOT_API = import.meta.env.REACT_APP_CHATBOT_API

export const useChatApi = () => {
  const { socketIOClientId, tokens, setTokens } = useSocket()
  const storedConversations = getWithExpiry('aiChat').value || [
    {
      type: 'apiMessage',
      message: 'Hi, I am AI. Ask me anything!',
      timeStamp: Date.now(),
    },
  ]
  const [conversations, setConversations] = useState(storedConversations)
  // const [tokens, setTokens] = useState(socketTokens || '')

  useEffect(() => {
    setWithExpiry('aiChat', conversations, socketIOClientId)
  }, [conversations])

  const query = async (data) => {
    const response = await fetch(CHATBOT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()
    addApiConversation({
      type: 'apiMessage',
      message: result.text,
      timeStamp: Date.now(),
    })
    // console.log(result)
    setTokens('')
  }

  const addApiConversation = (message) => {
    setConversations((prevConversations) => [...prevConversations, message])
  }

  const sendMessage = (message) => {
    addApiConversation(message)
    query({
      question: message.message,
      socketIOClientId,
    })
  }
  return { conversations, sendMessage, tokens }
}

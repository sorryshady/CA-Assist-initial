import { useState, useEffect } from 'react'
import { setWithExpiry, getWithExpiry } from '../utils/localstorage-expiry'
import { useAuth } from 'wasp/client/auth'
const PORT = import.meta.env.REACT_APP_CA_CHAT_PORT
export const useTelegramApi = () => {
  const { data } = useAuth()
  const chatType = localStorage.getItem('chatType')
  // const user = {
  //   id: data?.auth?.identities[0].providerUserId,
  //   userDetails: {
  //     firstName: data?.firstName,
  //     lastName: data?.lastName,
  //     email: data?.email,
  //     panNumber: data?.panNumber,
  //     primaryLanguage: data?.primaryLang,
  //     secondaryLanguage: data?.secondaryLang,
  //   },
  // }
  const user = {
    firstName: data?.firstName,
    lastName: data?.lastName,
    panNumber: data?.panNumber,
    preferredLanguage: data?.primaryLang,
    secondaryLanguage: data?.secondaryLang,
  }

  const storedConversations = getWithExpiry('caChat')?.value || [
    {
      type: 'caMessage',
      message: 'Start Chatting with a CA Expert',
      timeStamp: Date.now(),
    },
  ]
  const chat = localStorage.getItem('caChatId')
  const [caConversations, setCaConversations] = useState(storedConversations)

  useEffect(() => {
    setWithExpiry('caChat', caConversations)
  }, [caConversations])

  useEffect(() => {
    if (chatType === 'ca' && !chat) fetchData()
  }, [chatType])

  const CONNECT_URL = `http://localhost:${PORT}/api/connect`
  const fetchData = async () => {
    try {
      const respone = await fetch(CONNECT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      const result = await respone.json()
      localStorage.setItem('caChatId', result.chatId)
    } catch (err) {
      console.log(err)
    }
  }

  const query = async (message) => {
    if (chat && message.message) {
      const messageBody = {
        chat_id: chat,
        type: 'message',
        message: message.message,
      }
      const URL = `http://localhost:${PORT}/api/chat`
      try {
        const response = await fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(messageBody),
        })
      } catch (err) {
        console.log(err)
      }
    }
    setTimeout(
      () =>
        addCaConversations({
          type: 'caMessage',
          message: 'Dummy message for time being',
          timeStamp: Date.now(),
        }),
      1000
    )
  }

  const addCaConversations = (message) => {
    setCaConversations((prevConversations) => [...prevConversations, message])
  }

  const sendCaMessage = (message) => {
    addCaConversations(message)
    query(message)
  }
  return { caConversations, sendCaMessage }
}

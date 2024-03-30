import { useState, useEffect } from 'react'
import { setWithExpiry, getWithExpiry } from '../utils/localstorage-expiry'
import { useAuth } from 'wasp/client/auth'
import { useCaChat } from './useCaChat'
import { toast } from '@/components/ui/use-toast'
const PORT = import.meta.env.REACT_APP_CA_CHAT_PORT
export const useTelegramApi = () => {
  const { data } = useAuth()
  const { message } = useCaChat()
  const chatType = localStorage.getItem('chatType')
  // console.log(message)
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
      message:
        'Connecting you to available chartered accountants. Please wait a moment.',
      timeStamp: Date.now(),
    },
  ]
  const chat = localStorage.getItem('caChatId')
  const [caConversations, setCaConversations] = useState(storedConversations)

  useEffect(() => {
    addCaConversations(message)
  }, [message])
  useEffect(() => {
    setWithExpiry('caChat', caConversations)
  }, [caConversations])

  useEffect(() => {
    if (chatType === 'ca' && !chat) fetchData()
  }, [chatType])

  const CONNECT_URL = `http://localhost:${PORT}/api/connect`
  const fetchData = async () => {
    try {
      const response = await fetch(CONNECT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
      const result = await response.json()
      if (result.code === 404) {
        toast({
          title: 'Error',
          description: result.message,
        })
        return
      }

      localStorage.setItem('caChatId', result.chatId)
      localStorage.setItem('connected', false)
    } catch (err) {
      console.log(err)
      toast({
        title: 'Error',
        description: 'Failed to connect to CA Chat. Try again later.',
      })
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
  }

  const addCaConversations = (message) => {
    if (
      message.message ||
      message.fileData?.name ||
      message.voiceFileId ||
      message.voiceFileUrl
    )
      setCaConversations((prevConversations) => [...prevConversations, message])
  }

  const sendCaMessage = (message) => {
    addCaConversations(message)
    query(message)
  }
  return { caConversations, addCaConversations, sendCaMessage }
}

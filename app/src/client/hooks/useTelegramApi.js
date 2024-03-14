import { useState, useEffect } from 'react'
import { setWithExpiry, getWithExpiry } from '../utils/localstorage-expiry'
import { useAuth } from 'wasp/client/auth'
export const useTelegramApi = () => {
  const { data: user } = useAuth()
  const storedConversations = getWithExpiry('caChat')?.value || [
    {
      type: 'caMessage',
      message: 'Start Chatting with a CA Expert',
      timeStamp: Date.now(),
    },
  ]
  const [caConversations, setCaConversations] = useState(storedConversations)

  useEffect(() => {
    setWithExpiry('caChat', caConversations)
  }, [caConversations])

  const query = () => {
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
    query()
  }
  return { caConversations, sendCaMessage }
}

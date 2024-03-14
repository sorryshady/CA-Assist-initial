import { useState, useEffect } from 'react'
import { setWithExpiry, getWithExpiry } from '../utils/localstorage-expiry'
import { useAuth } from 'wasp/client/auth'
export const useTelegramApi = () => {
  const { data } = useAuth()
  const user = {
    id: data?.auth?.identities[0].providerUserId,
    userDetails: {
      firstName: data?.firstName,
      lastName: data?.lastName,
      email: data?.email,
      panNumber: data?.panNumber,
      primaryLanguage: data?.primaryLang,
      secondaryLanguage: data?.secondaryLang,
    },
  }

  const storedConversations = getWithExpiry('caChat')?.value || [
    {
      type: 'caMessage',
      message: 'Start Chatting with a CA Expert',
      timeStamp: Date.now(),
    },
  ]
  const session = getWithExpiry('caChat')?.sessionId || null
  const [caConversations, setCaConversations] = useState(storedConversations)
  const [sessionId, setSessionId] = useState(session)

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

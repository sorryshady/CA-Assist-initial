import { useState, useEffect } from 'react'
import { setWithExpiry, getWithExpiry } from '../utils/localstorage-expiry'

export const useTelegramApi = () => {
  const storedConversations = getWithExpiry('caChat')?.value || [
    {
      type: 'caMessage',
      message: 'Start Chatting with a CA Expert',
      timeStamp: Date.now(),
    },
  ]
  console.log(storedConversations)
  const [caConversations, setCaConversations] = useState(storedConversations)

  useEffect(() => {
    setWithExpiry('caChat', caConversations)
  }, [caConversations])

  const query = (async) => {
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

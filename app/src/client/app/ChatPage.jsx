// import React, { useState, useEffect } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { io } from 'socket.io-client'
// import { ChatWindow } from '../components/Chat/ChatWindow'
// import { setWithExpiry, getWithExpiry } from '@/client/utils/localstorage-expiry'
// const CHATBOT_API = import.meta.env.REACT_APP_CHATBOT_API
// const SOCKET_URL = import.meta.env.REACT_APP_SOCKET_URL
// export const ChatPage = ({ user }) => {
//   const userName = user.displayName || user.auth.identities[0].providerUserId
//   const credits = user.credits
//   const complete = user.completeAccount
//   const [loadingMessage, setLoadingMessage] = useState(false)
//   const storedConversations = getWithExpiry('aiChat')

//   const [conversations, setConversations] = useState(
//     storedConversations || [
//       {
//         type: 'apiMessage',
//         message: 'Hi, I am AI. Ask me anything!',
//         timeStamp: Date.now(),
//       },
//     ]
//   )
//   // const [conversations, setConversations] = useState({
//   //   ai: [
//   //     {
//   //       type: 'apiMessage',
//   //       message: 'Hi, I am AI. Ask me anything!',
//   //     },
//   //   ],
//   //   itr: [],
//   //   gst: [],
//   //   project: [],
//   // })
//   const [socketIOClientId, setSocketIOClientId] = useState('')
//   const [tokens, setTokens] = useState('')

//   useEffect(() => {
//     const socket = io(SOCKET_URL)
//     socket.on('connect', () => {
//       setSocketIOClientId(socket.id)
//     })
//     socket.on('start', () => {
//       setTokens('')
//       setLoadingMessage(false)
//       console.log('start')
//     })

//     socket.on('token', (token) => {
//       setTokens((prevTokens) => prevTokens + token)
//     })

//     socket.on('sourceDocuments', (sourceDocuments) => {
//       console.log('sourceDocuments:', sourceDocuments)
//     })

//     socket.on('end', () => {
//       // addApiConversation('ai', {
//       //   type: 'apiMessage',
//       //   message: tokens,
//       // })
//       // setTokens('')
//       console.log('end')
//     })
//     return () => {
//       socket.disconnect()
//     }
//   }, [])

//   useEffect(() => {
//     // window.localStorage.setItem('aiChat', JSON.stringify(conversations))
//     setWithExpiry('aiChat', conversations)
//   }, [conversations])

//   const query = async (data) => {
//     setLoadingMessage(true)
//     const response = await fetch(CHATBOT_API, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     })
//     const result = await response.json()
//     // addApiConversation('ai', {
//     //   type: 'apiMessage',
//     //   message: result.text,
//     //   timeStamp: Date.now(),
//     // })
//     addApiConversation({
//       type: 'apiMessage',
//       message: result.text,
//       timeStamp: Date.now(),
//     })
//     setTokens('')
//   }

//   const addApiConversation = (message) => {
//     setConversations((prevConversations) => [...prevConversations, message])
//   }
//   const handleSendMessage = (message) => {
//     addApiConversation(message)
//     query({
//       question: message.message,
//       socketIOClientId,
//     })
//     // setConversations((prevConversations) => {
//     //   const updatedConversations = {
//     //     ...prevConversations,
//     //     [tab]: [...prevConversations[tab], message],
//     //   }
//     //   return updatedConversations
//     // })
//     // if (tab == 'ai') {
//     //   query({
//     //     question: message.message,
//     //     socketIOClientId,
//     //   })
//     // }
//   }
//   return (
//     <>
//       <section className='w-full h-[90svh] m-auto flex flex-col items-center '>
//         <div className='w-full p-5 flex-1 overflow-y-auto h-full'>
//           <div className='flex-1'>
//             <h1 className='text-3xl font-bold'>AI Chat</h1>
//             <ChatWindow
//               tab='ai'
//               conversation={conversations}
//               sendMessage={handleSendMessage}
//               credits={credits}
//               complete={complete}
//               loadingMessage={loadingMessage}
//               tokens={tokens}
//             />
//             {/* <Tabs defaultValue='ai' className='w-full'>
//               <TabsList className='grid w-full grid-cols-4'>
//                 <TabsTrigger value='ai'>Chat with AI</TabsTrigger>
//                 <TabsTrigger value='itr'>ITR Filing</TabsTrigger>

//                 <TabsTrigger value='gst'>GST Filing Support</TabsTrigger>
//                 <TabsTrigger value='project'>
//                   Project Report Preparation
//                 </TabsTrigger>
//               </TabsList>
//               <TabsContent value='ai'>
//                 <ChatWindow
//                   tab='ai'
//                   conversation={conversations.ai}
//                   sendMessage={(message) => handleSendMessage('ai', message)}
//                   credits={credits}
//                   complete={complete}
//                   loadingMessage={loadingMessage}
//                   tokens={tokens}
//                 />
//               </TabsContent>
//               <TabsContent value='itr'>
//                 <ChatWindow
//                   tab='itr'
//                   conversation={conversations.itr}
//                   sendMessage={(message) => handleSendMessage('itr', message)}
//                   credits={credits}
//                   complete={complete}
//                 />
//               </TabsContent>
//               <TabsContent value='gst'>
//                 <ChatWindow
//                   tab='gst'
//                   conversation={conversations.gst}
//                   sendMessage={(message) => handleSendMessage('gst', message)}
//                   credits={credits}
//                   complete={complete}
//                 />
//               </TabsContent>
//               <TabsContent value='project'>
//                 <ChatWindow
//                   tab='project'
//                   conversation={conversations.project}
//                   sendMessage={(message) =>
//                     handleSendMessage('project', message)
//                   }
//                   credits={credits}
//                   complete={complete}
//                 />
//               </TabsContent>
//             </Tabs> */}
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }
import React, { useState } from 'react'
import { ChatWindow } from '../components/Chat/ChatWindow'
import { useChatApi } from '../hooks/useChatApi'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTelegramApi } from '../hooks/useTelegramApi'
import { MathJax } from 'better-react-mathjax'
import { Card } from '@/components/ui/card'
export const ChatPage = ({ user }) => {
  const credits = user.credits
  const complete = user.completeAccount
  const subscribed = user.subscriptionStatus
  const type = localStorage.getItem('chatType') || 'ai'
  const { conversations, sendMessage, tokens } = useChatApi()
  const { caConversations, sendCaMessage } = useTelegramApi()
  const [chatType, setChatType] = useState(type)
  const [hover, setHover] = useState(false)
  const changeHandler = () => {
    if (chatType === 'ai') {
      setChatType('ca')
      localStorage.setItem('chatType', 'ca')
    } else {
      setChatType('ai')
      localStorage.setItem('chatType', 'ai')
    }
  }

  const showMessage = (
    <Card className='p-2 text-sm text-slate-500 absolute right-[100%] w-fit text-nowrap'>
      You need a premium account to use this feature
    </Card>
  )
  return (
    <section className='w-full h-[90svh] m-auto flex flex-col items-center'>
      <div className='w-full p-5 flex-1 overflow-y-auto h-full'>
        <div className='flex-1'>
          <header className='w-full flex justify-between'>
            <h1 className='text-3xl font-bold'>
              {chatType === 'ai' ? 'AI Chat' : 'CA Chat'}
            </h1>
            <div
              className='flex items-center space-x-2 relative'
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {!subscribed && hover && showMessage}
              <Switch
                id='ca-ai-chat'
                onCheckedChange={changeHandler}
                checked={chatType === 'ca'}
                disabled={!subscribed}
              />
              <Label htmlFor='ca-ai-chat'>
                {chatType === 'ai' ? 'AI Chat' : 'CA Chat'}
              </Label>
            </div>
          </header>
          <ChatWindow
            chatType={chatType}
            conversation={chatType === 'ai' ? conversations : caConversations}
            sendMessage={chatType === 'ai' ? sendMessage : sendCaMessage}
            credits={credits}
            complete={complete}
            tokens={tokens}
          />
        </div>
      </div>
    </section>
  )
}

import React, { useEffect, useState } from 'react'
import { ChatWindow } from '../components/Chat/ChatWindow'
import { useChatApi } from '../hooks/useChatApi'
import { useHistory } from 'react-router-dom'
import { useTelegramApi } from '../hooks/useTelegramApi'
import {
  getUserLoginHistory,
  updateUserLoginInfo,
  getUserLoginRecord,
} from 'wasp/client/operations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
export const ChatPage = ({ user }) => {
  const history = useHistory()
  const credits = user.credits
  const complete = user.completeAccount
  const subscribed = user.subscriptionStatus
  const type = localStorage.getItem('chatType') || 'ai'
  const { conversations, sendMessage, tokens } = useChatApi()
  const { caConversations, sendCaMessage } = useTelegramApi()
  const [chatType, setChatType] = useState(type)
  const purchaseRedirect = () => {
    history.push('/purchase')
  }
  // useEffect(() => {
  //   fetchUserLoginDetails()
  // }, [])
  // const fetchUserLoginDetails = async () => {
  //   if (user) {
  //     const loginData = await getUserLoginHistory({ id: user.id })
  //     const details = await fetch('http://localhost:3000/api/get-info', {
  //       method: 'GET',
  //     })
  //     const data = await details.json()

  //     const record = await getUserLoginRecord()
  //     if (record?.userAgent === data?.userAgent && record?.ip === data?.ip) {
  //       return
  //     } else {
  //       if (loginData.length < 3) {
  //         updateUserLoginInfo(data)
  //       }
  //     }
  //   }
  // }
  return (
    <section className='w-full h-[90svh] m-auto flex flex-col items-center'>
      <div className='w-full flex-1 overflow-y-auto h-full'>
        <Tabs
          defaultValue={chatType}
          className='w-full'
          onValueChange={(value) => {
            setChatType(value)
            if (value === 'ca' && subscribed) {
              localStorage.setItem('chatType', value)
            } else {
              localStorage.setItem('chatType', 'ai')
            }
          }}
        >
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='ai'>AI Chat</TabsTrigger>
            <TabsTrigger value='ca'>CA Chat</TabsTrigger>
          </TabsList>
          <TabsContent value='ai'>
            <ChatWindow
              chatType={chatType}
              conversation={conversations}
              sendMessage={sendMessage}
              credits={credits}
              complete={complete}
              tokens={tokens}
            />
          </TabsContent>
          <TabsContent value='ca'>
            {!subscribed ? (
              <>
                <div className='w-full h-[60svh] text-center flex flex-col items-center justify-center gap-5 mt-[10svh]'>
                  <p>You should be a premium user to access this feature.</p>
                  {complete && (
                    <Button onClick={purchaseRedirect}>Purchase Premium</Button>
                  )}
                </div>
              </>
            ) : (
              <ChatWindow
                chatType={chatType}
                conversation={caConversations}
                sendMessage={sendCaMessage}
                credits={credits}
                complete={complete}
                tokens={tokens}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

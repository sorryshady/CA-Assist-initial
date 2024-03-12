import React from 'react'
import clsx from 'clsx'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SyncLoader from 'react-spinners/SyncLoader'
import { ChatBubbleWrapper } from './ChatBubbleWrapper'
import AiAvatar from '@/client/static/aiAvatar.jpeg'

const loader = <SyncLoader color='#bbb' size={7} speedMultiplier={0.6} />
export const LoaderBubble = () => {
  return (
    <ChatBubbleWrapper type='apiTokenMessage'>
      <Card
        className={clsx('w-fit', 'max-w-[50%]', 'py-2 px-4', 'flex-start')}
        variant='outline'
      >
        {loader}
      </Card>
      <Avatar>
        <AvatarImage src={AiAvatar} alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </ChatBubbleWrapper>
  )
}

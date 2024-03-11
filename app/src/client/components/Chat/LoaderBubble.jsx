import React from 'react'
import clsx from 'clsx'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import SyncLoader from 'react-spinners/SyncLoader'

const loader = <SyncLoader color='#bbb' size={7} speedMultiplier={0.6} />
export const LoaderBubble = () => {
  return (
    <div
      className={clsx(
        'flex',
        'flex-row-reverse',
        'justify-end',
        'gap-2',
        'mb-3'
      )}
    >
      <Card
        className={clsx('w-fit', 'max-w-[50%]', 'py-2 px-4', 'flex-start')}
        variant='outline'
      >
        {loader}
      </Card>
      <Avatar>
        <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    </div>
  )
}

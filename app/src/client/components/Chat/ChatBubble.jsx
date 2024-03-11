import clsx from 'clsx'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Marked } from '@ts-stack/markdown'
import SyncLoader from 'react-spinners/SyncLoader'

const loader = <SyncLoader color='#bbb' size={7} speedMultiplier={0.7} />
export const ChatBubble = ({ type, message }) => {
  return (
    <div
      className={clsx(
        'flex',
        { 'flex-row-reverse': type !== 'userMessage' },
        'justify-end',
        'gap-2',
        'mb-3'
      )}
    >
      {message ? (
        <Card
          className={clsx('w-fit', 'max-w-[50%]', 'py-2 px-4', {
            'flex-start': type !== 'userMessage',
          })}
          variant='outline'
          dangerouslySetInnerHTML={{ __html: Marked.parse(message) }}
        />
      ) : (
        <Card
          className={clsx('w-fit', 'py-2 px-4', 'flex-start')}
          variant='outline'
        >
          {loader}
        </Card>
      )}
      {type !== 'userMessage' && (
        <Avatar>
          <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

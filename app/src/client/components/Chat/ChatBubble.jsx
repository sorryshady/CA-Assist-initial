import clsx from 'clsx'
import { Card } from '@/components/ui/card'
import { Marked, Renderer } from '@ts-stack/markdown'
import { ChatBubbleWrapper } from './ChatBubbleWrapper'
import { setIcon } from '@/client/utils/iconMap'

export const ChatBubble = ({ type, message, fileData }) => {
  const icon = setIcon(fileData?.type)
  Marked.setOptions({
    renderer: new Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
  })
  return (
    <ChatBubbleWrapper type={type}>
      {message && !fileData?.name && (
        <Card
          className={clsx('w-fit', 'max-w-full', 'py-2 px-4', {
            'flex-start': type !== 'userMessage',
          })}
          variant='outline'
          dangerouslySetInnerHTML={{ __html: Marked.parse(message) }}
        />
      )}
      {fileData?.name && (
        <Card
          className={clsx(
            'w-fit',
            'max-w-full',
            'py-2 px-4',
            'flex',
            'items-center',
            'gap-4',
            {
              'flex-start': type !== 'userMessage',
            }
          )}
          variant='outline'
        >
          {icon}
          <p>{fileData?.name}</p>
        </Card>
      )}
    </ChatBubbleWrapper>
  )
}

import clsx from 'clsx'
import { Card } from '@/components/ui/card'
import { Marked, Renderer } from '@ts-stack/markdown'

export const ChatBubble = ({ type, message }) => {
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
    <div
      className={clsx(
        'flex',
        { 'flex-row-reverse': type !== 'userMessage' },
        'justify-end',
        'gap-2',
        'mb-6'
      )}
    >
      {message && (
        <Card
          className={clsx('w-fit', 'max-w-[50%]', 'py-2 px-4', {
            'flex-start': type !== 'userMessage',
          })}
          variant='outline'
          dangerouslySetInnerHTML={{ __html: Marked.parse(message) }}
        />
      )}
    </div>
  )
}

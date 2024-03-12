import clsx from 'clsx'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Marked, Renderer } from '@ts-stack/markdown'
import AiAvatar from '@/client/static/124599.jpeg'
export const AiResponseBubble = ({ type, message }) => {
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
        'flex-row-reverse',
        'justify-end',
        'gap-2',
        'mb-6'
      )}
    >
      {message && (
        <>
          <Card
            className={clsx('w-fit', 'max-w-[70%]', 'py-2 px-4', 'flex-start')}
            variant='outline'
            dangerouslySetInnerHTML={{ __html: Marked.parse(message) }}
          />
          <Avatar>
            <AvatarImage src={AiAvatar} alt='@shadcn' />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
        </>
      )}
    </div>
  )
}

import clsx from 'clsx'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Marked, Renderer } from '@ts-stack/markdown'
import AiAvatar from '@/client/static/aiAvatar.jpeg'
import { ChatBubbleWrapper } from './ChatBubbleWrapper'
import { CiShare1 } from 'react-icons/ci'
import { useToast } from '@/components/ui/use-toast'
export const AiResponseBubble = ({ type, message }) => {
  const { toast } = useToast()
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
  const shareHandler = () => {
    navigator.clipboard.writeText(message)
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    })
  }
  return (
    <>
      <ChatBubbleWrapper type={type}>
        {message && (
          <>
            <div>
              <Card
                className={clsx(
                  'w-fit',
                  'max-w-[65%]',
                  'py-2 px-4',
                  'flex-start'
                )}
                variant='outline'
                dangerouslySetInnerHTML={{ __html: Marked.parse(message) }}
              />
              <div
                className='text-sm cursor-pointer w-fit flex items-center gap-1 mt-1 hover:text-blue-500'
                onClick={shareHandler}
              >
                <p>Share</p>
                <CiShare1 className='inline-block' />
              </div>
            </div>
            <Avatar>
              <AvatarImage src={AiAvatar} alt='@shadcn' />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </>
        )}
      </ChatBubbleWrapper>
    </>
  )
}

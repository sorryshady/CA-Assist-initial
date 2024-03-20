import clsx from 'clsx'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Marked, Renderer } from '@ts-stack/markdown'
import AiAvatar from '@/client/static/aiAvatar.jpeg'
import { ChatBubbleWrapper } from './ChatBubbleWrapper'
import { MdOutlineContentCopy } from 'react-icons/md'
import { useToast } from '@/components/ui/use-toast'
import { Share } from './Share'
import * as clipboard from 'clipboard-polyfill'
import { MathJax } from 'better-react-mathjax'
import { setIcon } from '@/client/utils/iconMap'
import { HiDownload } from 'react-icons/hi'
export const ResponseBubble = ({ type, message, fileData }) => {
  const icon = setIcon(fileData?.type)
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
  const copyHandler = async () => {
    const htmlMessage = Marked.parse(message)
    // console.log(typeof htmlMessage)
    const item = new clipboard.ClipboardItem({
      'text/html': new Blob([htmlMessage], { type: 'text/html' }),
      'text/plain': new Blob([message], { type: 'text/plain' }),
    })
    await clipboard.write([item])
    toast({
      title: 'Copied',
      description: 'Copied to clipboard',
    })
  }
  return (
    <>
      <MathJax>
        <ChatBubbleWrapper type={type}>
          {message && !fileData?.name && (
            <>
              <div>
                <Card
                  className={clsx(
                    'w-fit',
                    'max-w-full',
                    'py-2 px-4',
                    'flex-start'
                  )}
                  variant='outline'
                  dangerouslySetInnerHTML={{ __html: Marked.parse(message) }}
                />
                <div className='text-sm  w-fit flex gap-2 items-center mt-2 ml-2'>
                  <Share message={message} />
                  <div
                    className='flex items-center gap-1  hover:text-blue-500 cursor-pointer'
                    onClick={copyHandler}
                  >
                    <MdOutlineContentCopy className='inline-block' />
                  </div>
                </div>
              </div>
              <Avatar>
                <AvatarImage src={AiAvatar} alt='@shadcn' />
                <AvatarFallback>
                  {type === 'apiMessage' ? 'AI' : 'CA'}
                </AvatarFallback>
              </Avatar>
            </>
          )}
          {fileData?.name && (
            <>
              <Card
                className={clsx('w-fit', 'max-w-full', 'p-1', {
                  'flex-start': type !== 'userMessage',
                })}
                variant='outline'
              >
                <p className='text-xs text-start mb-1 text-blue-400'>
                  File Attachment
                </p>
                <div className='flex gap-3 items-center bg-slate-100 py-2 px-4'>
                  {icon}
                  <p>{fileData?.name}</p>
                </div>
                <a
                  href={fileData?.url}
                  download={fileData?.name}
                  className='flex items-center gap-3 justify-center my-1 text-blue-400'
                >
                  <p className='text-sm'>Download</p>
                  <HiDownload />
                </a>
              </Card>
              <Avatar>
                <AvatarImage src={AiAvatar} alt='@shadcn' />
                <AvatarFallback>
                  {type === 'apiMessage' ? 'AI' : 'CA'}
                </AvatarFallback>
              </Avatar>
            </>
          )}
        </ChatBubbleWrapper>
      </MathJax>
    </>
  )
}

import clsx from 'clsx'
import { Card } from '@/components/ui/card'
import { Marked, Renderer } from '@ts-stack/markdown'
import { ChatBubbleWrapper } from './ChatBubbleWrapper'
import { setIcon } from '@/client/utils/iconMap'
import AudioPlayer from '../VoiceMessage/AudioPlayer'
import { useEffect, useState } from 'react'
export const ChatBubble = ({ type, message, fileData, voiceFileId }) => {
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
      {message && !fileData?.name && !voiceFileId && (
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
          className={clsx('w-fit', 'max-w-full', 'p-1', {
            'flex-start': type !== 'userMessage',
          })}
          variant='outline'
        >
          <p className='text-xs text-end mb-1 text-blue-400'>File Attachment</p>
          <div className='flex gap-3 items-center bg-slate-100 py-2 px-4'>
            {icon}
            <p>{fileData?.name}</p>
          </div>
        </Card>
      )}
      {voiceFileId && (
        <Card
          className={clsx('w-fit', 'max-w-full', 'p-1', {
            'flex-start': type !== 'userMessage',
          })}
          variant='outline'
        >
          <p className='text-xs text-end mb-1 text-blue-400'>Voice Note</p>
          <div className=' bg-slate-100 py-2 px-4'>
            {/* <p>Hello</p> */}
            <AudioPlayer audioId={voiceFileId} />
          </div>
        </Card>
      )}
    </ChatBubbleWrapper>
  )
}

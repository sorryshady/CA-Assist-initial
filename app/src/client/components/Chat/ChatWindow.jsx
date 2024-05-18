import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ChatBubble } from './ChatBubble'
import { ResponseBubble } from './ResponseBubble'
import { updateCredit } from 'wasp/client/operations'
import { useHistory } from 'react-router-dom'
import { LoaderBubble } from './LoaderBubble'
import { useFile } from '@/client/hooks/useFile'
import { useRecording } from '@/client/hooks/useRecording'
import { FaMicrophone } from 'react-icons/fa'
import { ImAttachment } from 'react-icons/im'
import Recording from '../VoiceMessage/Recording'
import { useToast } from '@/components/ui/use-toast'

export const ChatWindow = ({
  chatType,
  conversation,
  sendMessage,
  credits,
  complete,
  tokens,
}) => {
  const { toast } = useToast()
  const [audioSend, setAudioSend] = useState(false)
  const history = useHistory()
  const messageRef = useRef('')
  const chatEndRef = useRef(null)
  const { errorMessage, fileData, handleChange, handleSubmit, sending } =
    useFile()
  const {
    handleStartRecording,
    recording,
    handleStopRecording,
    close,
    handlePauseResumeRecording,
    paused,
    elapsedTime,
    deleteHandler,
    audioBlob,
    audioUrl,
    handleSendAudio,
  } = useRecording()
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView()
    }
  }

  const handleChangeCredit = async (credit) => {
    if (credits === 0) {
      if (complete) {
        toast({
          title: 'Insufficient credits',
          description:
            'Purchase more credits to continue. Redirecting to purchase page.',
        })
        setTimeout(() => {
          history.push('/purchase')
        }, 1500)
      } else {
        toast({
          title: 'Insufficient credits',
          description: 'Complete your account to gain extra credits.',
        })
        setTimeout(() => {
          history.push('/dashboard')
        }, 1500)
      }
    }
    try {
      await updateCredit({ credits: credit })
    } catch (error) {
      console.log(error.message)
    }
  }

  const sendMessageHandler = async () => {
    const message = messageRef.current.value.trim()
    if (message === '') return
    if (chatType === 'ai') await handleChangeCredit(-1)
    if (credits === 0 && chatType === 'ai') return
    sendMessage({ type: 'userMessage', message, timeStamp: Date.now() })
    messageRef.current.value = ''
  }

  const fileSubmit = () => {
    const saveFile = {
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
    }
    handleSubmit()
    sendMessage({
      type: 'userMessage',
      fileData: saveFile,
      timeStamp: Date.now(),
    })
  }

  const sendAudio = async () => {
    setAudioSend(true)
    const id = await handleSendAudio()
    setAudioSend(false)
    const messageBody = {
      type: 'userMessage',
      voiceFileId: id,
      timeStamp: Date.now(),
    }
    // console.log(messageBody)
    sendMessage(messageBody)
  }

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessageHandler()
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation, tokens, audioSend])

  const fileCard = (
    <Card className='flex flex-col gap-5 px-5 py-3 md:px-10 md:py-5 w-fit items-start justify-between absolute  top-[-160px] md:top-[-170px] left-4 md:left-5 '>
      <div className='w-10 text-center m-auto'>{fileData.icon}</div>
      <div className='flex gap-3'>
        <div>File: {fileData.name}</div>
        <div>Size: {fileData.size}</div>
      </div>
      <Button type='submit' className='w-full' onClick={fileSubmit}>
        Send
      </Button>
    </Card>
  )
  const error = (
    <p className='text-red-500 absolute top-[-10px]'>{errorMessage}</p>
  )
const connectedStatus = localStorage.getItem('connected')
return (
  <>
    <div className='w-full flex-1 overflow-y-auto max-h-[calc(100vh-250px)] flex flex-col mt-5 px-2 md:px-3 no-scrollbar'>
      {conversation.map(
        ({ type, message, fileData, voiceFileId, voiceFileUrl }, index) => {
          if (type === 'userMessage') {
            if (fileData?.name) {
              return <ChatBubble key={index} type={type} fileData={fileData} />
            } else if (voiceFileId) {
              return (
                <ChatBubble key={index} type={type} voiceFileId={voiceFileId} />
              )
            } else {
              return <ChatBubble key={index} type={type} message={message} />
            }
          } else if (type === 'apiMessage' || type === 'caMessage') {
            if (fileData?.name) {
              return (
                <ResponseBubble key={index} type={type} fileData={fileData} />
              )
            } else if (voiceFileUrl) {
              return (
                <ResponseBubble
                  key={index}
                  type={type}
                  audioFileUrl={voiceFileUrl}
                />
              )
            } else {
              return (
                <ResponseBubble key={index} type={type} message={message} />
              )
            }
          }
        }
      )}
      {sending && (
        <div className='text-end text-xs mt-[-20px] mr-2 text-slate-500'>
          Sending...
        </div>
      )}

      {audioSend && (
        <Card className='p-3 max-w-[15%] ml-auto'>
          <div className='text-xs mr-2 text-slate-500 text-center'>
            Sending Audio...
          </div>
        </Card>
      )}

      {!tokens &&
        conversation[conversation.length - 1].type !== 'apiMessage' &&
        chatType === 'ai' && <LoaderBubble />}
      {tokens && tokens !== conversation[conversation.length - 1].message && (
        <ResponseBubble type='apiMessage' message={tokens} />
      )}
      <div ref={chatEndRef} />
    </div>
    {chatType === 'ai' || (chatType === 'ca' && connectedStatus) ? (
      <footer className='w-full flex justify-between px-4 py-4 md:px-5 md:py-5 gap-2 md:gap-3 lg:gap-5 fixed bottom-0 left-0 '>
        {fileData.name && fileCard}
        {close && (
          <Recording
            recording={recording}
            pausePlay={handlePauseResumeRecording}
            stop={handleStopRecording}
            paused={paused}
            elapsedTime={elapsedTime}
            deleteAudio={deleteHandler}
            audioBlob={audioBlob}
            audioUrl={audioUrl}
            send={sendAudio}
          />
        )}
        {errorMessage && error}
        {chatType !== 'ai' && (
          <>
            <Button
              className='relative overflow-hidden !cursor-pointer p-3 md:p-5'
              disabled={close}
            >
              <span>
                <ImAttachment size={16} />
              </span>
              <Input
                id='file'
                type='file'
                className='absolute top-0 left-0 opacity-0 w-full'
                onChange={handleChange}
                onClick={(e) => (e.target.value = null)}
              />
            </Button>
            <Button
              onClick={handleStartRecording}
              disabled={close}
              className='p-3 md:p-5'
            >
              <FaMicrophone size={16} />
            </Button>
          </>
        )}
        <Input
          placeholder='Type a message...'
          type='text'
          ref={messageRef}
          onKeyPress={onEnter}
        />
        <Button
          className='p-3 md:p-5 text-xs md:text-sm'
          type='submit'
          onClick={sendMessageHandler}
        >
          Send
        </Button>
      </footer>
    ) : null}
  </>
)
}

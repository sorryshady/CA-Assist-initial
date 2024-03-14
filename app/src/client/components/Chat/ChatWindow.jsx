// import React, { useEffect, useRef, useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from '@/components/ui/alert-dialog'
// import { updateCredit } from 'wasp/client/operations'
// import { useHistory } from 'react-router-dom'

// import { ChatBubble } from './ChatBubble'
// import { AiResponseBubble } from './AiResponseBubble'
// import { LoaderBubble } from './LoaderBubble'
// export const ChatWindow = ({
//   tab,
//   conversation,
//   sendMessage,
//   credits,
//   complete,
//   loadingMessage,
//   tokens,
// }) => {
//   const messageRef = useRef('')
//   const history = useHistory()
//   // const [file, setFile] = useState()
//   // const [errorMessage, setErrorMessage] = useState('')
//   // const [fileData, setFileData] = useState({
//   //   name: '',
//   //   size: '',
//   // })
//   const chatContainerRef = useRef(null)
//   const scrollToBottom = () => {
//     chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
//   }
//   // const [conv, setConv] = useState('')
//   const handleChangeCredit = async (credit) => {
//     if (credits == 0) {
//       if (complete) {
//         history.push('/purchase')
//       } else {
//         history.push('/userInfo')
//       }
//     }
//     try {
//       await updateCredit({ credits: credit })
//     } catch (error) {
//       console.log(error.message)
//     }
//   }
//   // const handleChange = (e) => {
//   //   const validTypes = [
//   //     'application/pdf',
//   //     'text/plain',
//   //     'application/vnd.ms-excel',
//   //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   //     'application/msword',
//   //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//   //   ]

//   //   const file = e.target.files[0]
//   //   const fileSize = file.size
//   //   const fileName = file.name
//   //   const fileType = file.type
//   //   if (fileSize > 5 * 1024 * 1024) {
//   //     setErrorMessage('File size should be less than 5MB')
//   //     return
//   //   } else {
//   //     setErrorMessage('')
//   //   }
//   //   if (!validTypes.includes(fileType)) {
//   //     setErrorMessage('Invalid file type')
//   //     return
//   //   } else {
//   //     setErrorMessage('')
//   //   }
//   //   let size = 0
//   //   if (fileSize < 1024 * 1024) {
//   //     size = (fileSize / 1024).toFixed(1) + ' KB'
//   //   } else {
//   //     size = (fileSize / (1024 * 1024)).toFixed(1) + ' MB'
//   //   }
//   //   setFileData({
//   //     name: fileName,
//   //     size,
//   //   })
//   //   setFile(file)
//   // }
//   const sendMessageHandler = () => {
//     const message = messageRef.current.value.trim()
//     if (message === '') return
//     handleChangeCredit(-1)
//     sendMessage({ type: 'userMessage', message, timeStamp: Date.now() })
//     messageRef.current.value = ''
//   }

//   const onEnter = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault()
//       sendMessageHandler()
//     }
//   }
//   useEffect(() => {
//     scrollToBottom()
//   }, [conversation])
//   // const choiceOptions = (
//   //   <div className='absolute bottom-0 flex items-center justify-center w-full gap-5'>
//   //     <AlertDialog>
//   //       <AlertDialogTrigger asChild>
//   //         <Button variant='outline' onClick={() => setConv('ITR Filing')}>
//   //           ITR Filing
//   //         </Button>
//   //       </AlertDialogTrigger>
//   //       <AlertDialogTrigger asChild>
//   //         <Button
//   //           variant='outline'
//   //           onClick={() => setConv('GST Filing Support')}
//   //         >
//   //           GST Filing Support
//   //         </Button>
//   //       </AlertDialogTrigger>
//   //       <AlertDialogTrigger>
//   //         <Button
//   //           variant='outline'
//   //           onClick={() => setConv('Project Report Preparation')}
//   //         >
//   //           Project Report Preparation
//   //         </Button>
//   //       </AlertDialogTrigger>
//   //       <AlertDialogContent>
//   //         <AlertDialogHeader>
//   //           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//   //           <AlertDialogDescription>
//   //             You have chosen {conv}. If you wish to proceed we will connect you
//   //             to an expert. You can continue chatting with AI if you wish.
//   //           </AlertDialogDescription>
//   //         </AlertDialogHeader>
//   //         <AlertDialogFooter>
//   //           <AlertDialogCancel>Cancel</AlertDialogCancel>
//   //           <AlertDialogAction
//   //             onClick={() => {
//   //               const conversation =
//   //                 conv === 'ITR Filing'
//   //                   ? 'itr'
//   //                   : conv === 'GST Filing Support'
//   //                   ? 'gst'
//   //                   : 'project'

//   //               updateConv({ currentConv: conversation })
//   //               updateCredit({ credits: -1 })
//   //               setConv('')
//   //             }}
//   //           >
//   //             Continue
//   //           </AlertDialogAction>
//   //         </AlertDialogFooter>
//   //       </AlertDialogContent>
//   //     </AlertDialog>
//   //   </div>
//   // )

//   return (
//     <>
//       <div
//         className='w-full flex-1 overflow-y-auto max-h-[calc(100vh-250px)] flex flex-col mt-5'
//         ref={chatContainerRef}
//       >
//         {conversation.map(({ type, message, timeStamp }, index) => {
//           if (type === 'userMessage')
//             return <ChatBubble key={index} type={type} message={message} />
//           else if (type === 'apiMessage')
//             return (
//               <AiResponseBubble key={index} type={type} message={message} />
//             )
//         })}
//         {/* {credits === 1 && complete && choiceOptions} */}
//         {/* {loadingMessage && <LoaderBubble />} */}
//         {tokens && tokens !== conversation[conversation.length - 1].message && (
//           <AiResponseBubble type='apiMessage' message={tokens} />
//         )}
//       </div>
//       <footer className='w-full flex justify-between px-5 py-5 gap-5 fixed bottom-0 left-0 my-5'>
//         {/* {fileData.name && (
//           <Card className='flex flex-col gap-5 px-10 py-5 w-fit items-start justify-between absolute top-[-170px] left-5 '>
//             <div>File: {fileData.name}</div>
//             <div>Size: {fileData.size}</div>
//             <Button type='submit' className='w-full'>
//               Send
//             </Button>
//           </Card>
//         )}
//         {errorMessage && (
//           <p className='text-red-500 absolute top-[-10px]'>{errorMessage}</p>
//         )} */}
//         {tab !== 'ai' && (
//           <Button className='relative overflow-hidden !cursor-pointer'>
//             <span>+</span>
//             <Input
//               id='file'
//               type='file'
//               className='absolute top-0 left-0 opacity-0 w-full '
//               onChange={handleChange}
//             />
//           </Button>
//         )}
//         <Input
//           placeholder='Type a message...'
//           type='text'
//           ref={messageRef}
//           onKeyPress={onEnter}
//         />
//         <Button type='submit' onClick={sendMessageHandler}>
//           Send
//         </Button>
//       </footer>
//     </>
//   )
// }
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatBubble } from './ChatBubble'
import { AiResponseBubble } from './AiResponseBubble'
import { updateCredit } from 'wasp/client/operations'
import { useHistory } from 'react-router-dom'
import { LoaderBubble } from './LoaderBubble'

export const ChatWindow = ({
  chatType,
  conversation,
  sendMessage,
  credits,
  complete,
  tokens,
}) => {
  const history = useHistory()
  const messageRef = useRef('')
  const chatEndRef = useRef(null)

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView()
    }
  }

  const handleChangeCredit = async (credit) => {
    if (credits === 0) {
      if (complete) {
        history.push('/purchase')
      } else {
        history.push('/userInfo')
      }
    }
    try {
      await updateCredit({ credits: credit })
    } catch (error) {
      console.log(error.message)
    }
  }

  const sendMessageHandler = () => {
    const message = messageRef.current.value.trim()
    if (message === '') return
    handleChangeCredit(-1)
    sendMessage({ type: 'userMessage', message, timeStamp: Date.now() })
    messageRef.current.value = ''
  }

  const onEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessageHandler()
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation, tokens])

  return (
    <>
      <div className='w-full flex-1 overflow-y-auto max-h-[calc(100vh-250px)] flex flex-col mt-5 px-3'>
        {conversation.map(({ type, message }, index) => {
          if (type === 'userMessage')
            return <ChatBubble key={index} type={type} message={message} />
          else if (type === 'apiMessage' || type === 'caMessage')
            return (
              <AiResponseBubble key={index} type={type} message={message} />
            )
        })}
        {!tokens &&
          conversation[conversation.length - 1].type !== 'apiMessage' &&
          conversation[conversation.length - 1].type !== 'caMessage' && (
            <LoaderBubble />
          )}
        {tokens && tokens !== conversation[conversation.length - 1].message && (
          <AiResponseBubble type='apiMessage' message={tokens} />
        )}
        <div ref={chatEndRef} />
      </div>
      <footer className='w-full flex justify-between px-5 py-5 gap-5 fixed bottom-0 left-0 my-5'>
        {chatType !== 'ai' && (
          <Button className='relative overflow-hidden !cursor-pointer'>
            <span>+</span>
            <Input
              id='file'
              type='file'
              className='absolute top-0 left-0 opacity-0 w-full '
              // onChange={handleChange}
            />
          </Button>
        )}
        <Input
          placeholder='Type a message...'
          type='text'
          ref={messageRef}
          onKeyPress={onEnter}
        />
        <Button type='submit' onClick={sendMessageHandler}>
          Send
        </Button>
      </footer>
    </>
  )
}

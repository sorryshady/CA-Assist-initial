import React from 'react'

import { CiShare1 } from 'react-icons/ci'
import { Button } from '@/components/ui/button'
import { IoLogoWhatsapp } from 'react-icons/io'
import { BiLogoGmail } from 'react-icons/bi'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
export const Share = ({ message }) => {
  const shareHandler = (type) => {
    const encodedMessage = encodeURIComponent(message)
    if (type === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedMessage}`)
    } else {
      window.open(`mailto:?body=${encodedMessage}`)
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex items-center gap-1  hover:text-blue-500 cursor-pointer'>
          <CiShare1 className='inline-block' />
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Share Message</DialogTitle>
          <DialogDescription>
            Share Message via Whatsapp or email
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-evenly items-center my-10'>
          <div className='flex justify-center flex-col gap-3 min-w-11 items-center'>
            <DialogClose asChild>
              <Button
                variant='outline'
                onClick={() => shareHandler('whatsapp')}
              >
                <IoLogoWhatsapp />
              </Button>
            </DialogClose>
            <p className='text-xs font-bold'>WhatsApp</p>
          </div>
          <div className='flex justify-center flex-col gap-3 min-w-11 items-center'>
            <DialogClose asChild>
              <Button variant='outline' onClick={() => shareHandler('email')}>
                <BiLogoGmail />
              </Button>
            </DialogClose>
            <p className='text-xs font-bold'>Email</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import React from 'react'

export const ShareReply = ({ setHover }) => {
  return (
    <Card className='absolute top-[-150%] right-[10%] p-3 flex gap-3'>
      <Button className='w-full' onClick={() => setHover(false)}>
        Share{' '}
      </Button>
      <Button className='w-full' onClick={() => setHover(false)}>
        Reply
      </Button>
    </Card>
  )
}

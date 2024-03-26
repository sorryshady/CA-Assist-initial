import React from 'react'
import { Card } from '@/components/ui/card'
import { ResetPasswordForm } from 'wasp/client/auth'
import { Link } from 'react-router-dom'
import { authAppearance } from './appearance'
export const PasswordReset = () => {
  return (
    <Card className='max-w-[800px] p-5 m-auto mt-[20svh]'>
      <ResetPasswordForm appearance={authAppearance} />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        If everything is okay,{' '}
        <Link to='/chat' className='text-blue-500'>
          go to chat
        </Link>
      </span>
    </Card>
  )
}

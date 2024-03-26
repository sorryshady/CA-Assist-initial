import { Card } from '@/components/ui/card'
import React from 'react'
import { VerifyEmailForm } from 'wasp/client/auth'
import { Link } from 'react-router-dom'
import { authAppearance } from './appearance'
export const EmailVerification = () => {
  return (
    <Card className='max-w-[800px] p-5 m-auto mt-[20svh]'>
      <VerifyEmailForm appearance={authAppearance} />
      <br />
      <span className='text-sm font-medium text-gray-900'>
        If everything is okay,{' '}
        <Link to='/login' className='text-blue-500'>
          go to login
        </Link>
      </span>
    </Card>
  )
}

import React from 'react'
import { Card } from '@/components/ui/card'
import { ForgotPasswordForm } from 'wasp/client/auth'
import { authAppearance } from './appearance'
export const RequestPasswordReset = () => {
  return (
    <Card className='max-w-[800px] p-5 m-auto mt-[20svh]'>
      <ForgotPasswordForm appearance={authAppearance} />
    </Card>
  )
}

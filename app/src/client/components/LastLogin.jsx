import React from 'react'
import { Card } from '@/components/ui/card'
const LastLogin = ({ data }) => {
  const { userAgent, ip, country, regionName } = data
  return (
    <Card className='w-full max-w-[95%] sm:max-w-[90%] md:w-[800px] mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold mb-2'>Last Login</h1>
      <p>User: {userAgent}</p>
      <p>Region: {regionName}</p>
      <p>Country: {country}</p>
    </Card>
  )
}

export default LastLogin

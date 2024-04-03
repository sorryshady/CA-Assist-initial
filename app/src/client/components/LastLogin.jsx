import React from 'react'
import { Card } from '@/components/ui/card'
const LastLogin = ({ data }) => {
  const { userAgent, ip, country, regionName } = data
  return (
    <Card className='w-[800px] mx-auto p-4 flex flex-col justify-center items-center'>
      <h1 className='text-2xl font-bold mb-2'>Last Login</h1>
      <p>User: {userAgent}</p>
      <p>Region: {regionName}</p>
      <p>Country: {country}</p>
    </Card>
  )
}

export default LastLogin

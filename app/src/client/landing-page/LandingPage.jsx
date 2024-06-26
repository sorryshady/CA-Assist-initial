import React from 'react'
import { useAuth } from 'wasp/client/auth'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import DotGrid from '../components/dot-grid/dot-grid'
export const LandingPage = () => {
  const { data: user } = useAuth()

  // const { toast } = useToast()
  // const history = useHistory()
  // if (user) {
  //   toast({ title: 'Already logged in', description: 'Redirecting to chat' })
  //   history.push('/chat')
  // }

  return (
    <main className='w-full h-[90svh] flex items-center justify-center overflow-hidden'>
      <DotGrid />
      <div className='w-full flex-1 flex flex-col justify-center gap-5 p-5 z-10 bg-white lg:bg-transparent'>
        <h1 className='text-4xl md:text-3xl  font-semibold'>
          Need expert advice on taxes?
        </h1>
        <p className='text-lg'>
          Chat with our group of experts to make your tax preparation easy
        </p>
        <div className='flex gap-10 '>
          <Button className='w-full' asChild>
            {!user ? (
              <Link to='/signup'>Get Started</Link>
            ) : (
              <Link to='/chat'>Continue to Chat</Link>
            )}
          </Button>
          <Button className='w-full' variant='outline' asChild>
            <Link to='/info'>Learn More</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

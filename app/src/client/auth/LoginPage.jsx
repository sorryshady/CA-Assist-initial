import { Link } from 'react-router-dom'
import { LoginForm } from 'wasp/client/auth'
import { Card } from '@/components/ui/card'
import { authAppearance } from './appearance'
import { useHistory } from 'react-router-dom'
import { useAuth } from 'wasp/client/auth'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useRef } from 'react'
export const LoginPage = () => {
  const { toast } = useToast()
  const { data: user } = useAuth()
  const history = useHistory()
  const handleGoogleLogin = () => {
    localStorage.setItem('googleLogin', true)
  }
  useEffect(() => {
    const googleLogin = document.querySelector('.c-jrXXwF')
    googleLogin.addEventListener('click', handleGoogleLogin)
    // console.log(localStorage.getItem('googleLogin') === true, user)
    if (localStorage.getItem('googleLogin') === 'true' && !user) {
      toast({
        title: 'Google login failed',
        description:
          'This google address is already registered.Try signing in using email and password. ',
      })
    }
  }, [])
  if (user) {
    toast({ title: 'Already logged in', description: 'Redirecting to chat' })
    history.push('/chat')
  }
  return (
    <Card className='max-w-[800px] p-5 m-auto mt-[20svh]'>
      <LoginForm appearance={authAppearance} />
      <br />
      <span>
        Don't have an account yet?{' '}
        <Link to='/signup' className='text-blue-500'>
          Register
        </Link>
      </span>
    </Card>
  )
}

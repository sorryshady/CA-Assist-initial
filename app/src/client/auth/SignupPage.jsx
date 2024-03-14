import { Link } from 'react-router-dom'
import { SignupForm } from 'wasp/client/auth'
import { Card } from '@/components/ui/card'
import { authAppearance } from './appearance'
import { useHistory } from 'react-router-dom'
import { useAuth } from 'wasp/client/auth'
import { useToast } from '@/components/ui/use-toast'
export const SignupPage = () => {
  const { toast } = useToast()
  const { data: user } = useAuth()
  const history = useHistory()
  if (user) {
    toast({ title: 'Already logged in', description: 'Redirecting to chat' })
    history.push('/')
  }
  return (
    <Card className='max-w-[800px] p-5 m-auto mt-[20svh]'>
      <SignupForm appearance={authAppearance} />
      <br />
      <span>
        Already have an account?{' '}
        <Link to='/login' className='text-blue-500'>
          Login
        </Link>
      </span>
    </Card>
  )
}

import { Link } from 'react-router-dom'
import { SignupForm } from 'wasp/client/auth'
import { Card } from '@/components/ui/card'
import { authAppearance } from './appearance'
export const SignupPage = () => {
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

import { Link } from 'react-router-dom'
import { LoginForm } from 'wasp/client/auth'
import { Card } from '@/components/ui/card'
import { authAppearance } from './appearance'
export const LoginPage = () => {
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

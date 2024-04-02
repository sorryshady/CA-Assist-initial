import { useAuth } from 'wasp/client/auth'
import {
  updateCurrentUser,
  getUserLoginHistory,
  updateUserLoginInfo,
  getUserLoginRecord,
} from 'wasp/client/operations'
import './global.css'
import './Main.css'
import { useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AppNavBar from './components/AppNavBar'
import { Toaster } from '@/components/ui/toaster'

const App = ({ children }) => {
  const fetchUserLoginDetails = async () => {
    if (user) {
      const loginData = await getUserLoginHistory({ id: user.id })
      const details = await fetch('http://localhost:3000/api/ip-stats', {
        method: 'GET',
      })
      const data = await details.json()
      const record = await getUserLoginRecord()
      if (record?.userAgent === data?.userAgent && record?.ip === data?.ip) {
        return
      } else {
        if (loginData.length <= 3) {
          await updateUserLoginInfo(data)
        }
      }
    }
  }
  const location = useLocation()
  const { data: user } = useAuth()

  const shouldDisplayAppNavBar = useMemo(() => {
    return location.pathname !== '/login' && location.pathname !== '/signup'
  }, [location])
  const isAdminDashboard = useMemo(() => {
    return location.pathname.startsWith('/admin')
  }, [location])

  useEffect(() => {
    if (user) {
      // fetchUserLoginDetails()
      localStorage.removeItem('googleLogin')
      const lastSeenAt = new Date(user.lastActiveTimestamp)
      const today = new Date()
      if (today.getTime() - lastSeenAt.getTime() > 5 * 60 * 1000) {
        updateCurrentUser({ lastActiveTimestamp: today })
      }
    }
  }, [user])

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView()
      }
    }
  }, [location])
  return (
    <>
      <div className='min-h-screen dark:text-white dark:bg-boxdark-2'>
        {isAdminDashboard ? (
          <>{children}</>
        ) : (
          <>
            {shouldDisplayAppNavBar && <AppNavBar />}
            {/* <div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl md:max-w-screen-2xl xl:max-w-screen-3xl'> */}
            <div className='mx-auto px-4 sm:px-6 lg:px-8'>{children}</div>
          </>
        )}
      </div>
      <Toaster />
    </>
  )
}

export default App

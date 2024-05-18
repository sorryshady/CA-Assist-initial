import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
export const CheckoutPage = () => {
  const [paymentStatus, setPaymentStatus] = useState('loading')

  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    function delayedRedirect() {
      return setTimeout(() => {
        history.push('/chat')
      }, 4000)
    }

    const queryParams = new URLSearchParams(location.search)
    const isSuccess = queryParams.get('success')
    const isCanceled = queryParams.get('canceled')

    if (isCanceled) {
      setPaymentStatus('canceled')
    } else if (isSuccess) {
      setPaymentStatus('paid')
    } else {
      history.push('/account')
    }
    delayedRedirect()
    return () => {
      clearTimeout(delayedRedirect())
    }
  }, [location])
  return (
    <div className='flex min-h-full items-center justify-center'>
      <div className='w-full max-w-md mx-auto'>
        <div className='bg-white dark:bg-gray-800 shadow-md rounded-md p-6'>
          <h1 className='text-3xl font-bold text-center mb-6'>
            {paymentStatus === 'paid'
              ? '🥳 Payment Successful!'
              : paymentStatus === 'canceled'
              ? '😢 Payment Canceled'
              : '🙄 Payment Error'}
          </h1>
          {paymentStatus !== 'loading' && (
            <p className='text-center'>
              You are being redirected to your account page...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

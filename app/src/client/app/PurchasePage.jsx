import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  updateCredit,
  updateSubscriberStatus,
  stripePayment,
} from 'wasp/client/operations'

const STRIPE_CUSTOMER_PORTAL =
  'https://billing.stripe.com/p/login/test_aEUg2bgQQ4B6fcc000'
export const PurchasePage = ({ user }) => {
  const [isStripePaymentLoading, setIsStripePaymentLoading] = useState(false)
  const { toast } = useToast()
  const handleChangeCredit = async (credits) => {
    try {
      await updateCredit({ credits })
      toast({
        title: 'Credits added',
        description: 'Credits added successfully',
      })
    } catch (error) {
      console.log(error.message)
    }
  }
  const handleSubscribe = async () => {
    try {
      await updateSubscriberStatus({ subscriptionStatus: true })
      await updateCredit({ credits: 20 })
      toast({
        title: 'Subscription successful',
        description: 'You are now a premium member',
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleBuy = async (tier) => {
    try {
      setIsStripePaymentLoading(tier)
      let stripeResults = await stripePayment(tier)
      if (stripeResults?.sessionUrl) {
        window.open(stripeResults.sessionUrl, '_self')
      }
    } catch (error) {
      console.error(error?.message ?? 'Something went wrong.')
    } finally {
      setIsStripePaymentLoading(false)
    }
  }
  return (
    <section className=' min-h-[90svh] flex flex-col'>
      <h1 className='text-3xl font-bold text-center mt-[10svh]'>
        Pricing Plans
      </h1>
      <p className='text-lg  my-5 max-w-[1000px] m-auto text-center'>
        Get expert financial advice at your fingertips with our flexible pricing
        plans. Choose the plan that suits your needs and budget, and start
        chatting with our AI chatbot or connect with real financial advisors
        today.
      </p>
      <div className='flex '>
        <Card className='p-5 flex flex-col items-center min-w-[350px]  mt-10 mx-auto'>
          <h1 className='text-xl font-bold mb-1'>Purchase Credits </h1>
          <div className='text-xs text-red-500'>* used for AI chat only.</div>
          <div className='flex flex-col gap-5 items-center justify-center'>
            <h2 className='text-lg font-bold mt-3'>Credit options</h2>
            <div>10 credits</div>
            <div className='h-[1px] w-full bg-gray-300' />
            <div>20 credits</div>
            <div className='h-[1px] w-full bg-gray-300' />
            <div>30 credits</div>
          </div>
          {/* <Button className='mt-5' onClick={() => handleChangeCredit(10)}> */}
          <Button className='mt-5' onClick={() => handleBuy('CREDITS')}>
            Purchase
          </Button>
        </Card>
        <Card className='p-5 flex flex-col gap-5 items-center min-w-[350px]  mt-10 mx-auto justify-between'>
          <h1 className='text-xl font-bold'>Premium Plan.</h1>
          <div className='flex flex-col gap-5 items-center justify-center'>
            <h2 className='text-lg font-bold'>Features</h2>
            <div>20 free credits</div>
            <div>Unlimited access to chartered accountants.</div>
          </div>
          {/* <Button onClick={handleSubscribe} disabled={user.subscriptionStatus}> */}
          {user.subscriptionStatus && (
            <a href={STRIPE_CUSTOMER_PORTAL} className='text-blue-500'>
              Manage Subscription
            </a>
          )}
          <Button
            onClick={() => handleBuy('SUBSCRIPTION')}
            disabled={user.subscriptionStatus}
          >
            {user.subscriptionStatus ? 'Already subscribed' : 'Subscribe'}
          </Button>
        </Card>
      </div>
      <Button
        className='mt-[10svh] mx-auto'
        onClick={() => window.history.back()}
      >
        Back
      </Button>
    </section>
  )
}

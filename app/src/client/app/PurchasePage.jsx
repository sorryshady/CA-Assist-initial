import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  updateCredit,
  updateSubscriberStatus,
  stripePayment,
} from 'wasp/client/operations'
import { tiers } from './planData'
import { AiFillCheckCircle } from 'react-icons/ai'

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
    <section className='min-h-[90svh] flex flex-col p-4 sm:p-6 md:p-8'>
      <h1 className='text-3xl font-bold text-center '>Pricing Plans</h1>
      <p className='text-base sm:text-lg my-5 max-w-[1000px] mx-auto text-center'>
        Get expert financial advice at your fingertips with our flexible pricing
        plans. Choose the plan that suits your needs and budget, and start
        chatting with our AI chatbot or connect with real financial advisors
        today.
      </p>
      <div className='mx-auto grid grid-cols-1 gap-8 lg:max-w-[1000px] lg:grid-cols-2'>
        {tiers.map((tier) => (
          <Card
            key={tier.name}
            className='p-5 flex flex-col min-w-[90%] sm:min-w-[350px] lg:mt-10 justify-between'
          >
            <div>
              <div className='flex items-center justify-center gap-x-4 text-center'>
                <h3 className='text-gray-900 text-lg font-semibold leading-8 dark:text-white'>
                  {tier.name}
                </h3>
              </div>
              <p className='mt-4 text-sm leading-6 text-gray-600 dark:text-white text-center'>
                {tier.description}
              </p>
              <div className='mt-6 flex items-baseline gap-x-1 dark:text-white justify-center'>
                <p className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white'>
                  {tier.price}
                </p>
              </div>
            </div>
            <ul
              role='list'
              className='mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-white'
            >
              {tier.features.map((feature) => (
                <li key={feature} className='flex gap-x-3'>
                  <AiFillCheckCircle
                    className='h-6 w-5 flex-none text-slate-500'
                    aria-hidden='true'
                  />
                  {feature}
                </li>
              ))}
            </ul>
            {tier.tier === 'CREDITS' ? (
              <Button
                className='mt-5'
                onClick={() => handleBuy('CREDITS')}
                disabled={isStripePaymentLoading}
              >
                Purchase
              </Button>
            ) : (
              <Button
                className='mt-5'
                onClick={() => handleBuy('SUBSCRIPTION')}
                disabled={isStripePaymentLoading || user.subscriptionStatus}
              >
                {user.subscriptionStatus ? 'Premium User' : 'Purchase'}
              </Button>
            )}
          </Card>
        ))}
      </div>
      <Button
        className='mt-[8svh]  mx-auto'
        onClick={() => window.history.back()}
      >
        Back
      </Button>
    </section>
  )
}

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { updateCredit, updateSubscriberStatus } from 'wasp/client/operations'
export const PurchasePage = ({ user }) => {
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
      toast({
        title: 'Subscription successful',
        description: 'You are now a premium member',
      })
    } catch (error) {
      console.log(error.message)
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
        <Card className='p-5 flex flex-col gap-5 items-center max-w-[200px]  mt-10 mx-auto'>
          <div>Purchase Credits to continue chat.</div>
          <Button onClick={() => handleChangeCredit(10)}>
            Get more credits
          </Button>
        </Card>
        <Card className='p-5 flex flex-col gap-5 items-center max-w-[200px]  mt-10 mx-auto'>
          <div>Purchase Premium Plan.</div>
          <Button onClick={handleSubscribe} disabled={user.subscriptionStatus}>
            {user.subscriptionStatus ? 'Already subscribed' : 'Subscribe'}
          </Button>
        </Card>
      </div>
      <Button className='mt-5 mx-auto' onClick={() => window.history.back()}>
        Back
      </Button>
    </section>
  )
}

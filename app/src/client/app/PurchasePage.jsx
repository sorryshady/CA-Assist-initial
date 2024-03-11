import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { updateCredit } from 'wasp/client/operations'
export const PurchasePage = () => {
  const handleChangeCredit = async (credits) => {
    try {
      await updateCredit({ credits })
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
      <Card className='p-5 flex flex-col gap-5 items-center max-w-[200px]  mt-10 mx-auto'>
        <div>Purchase Credits to continue chat.</div>
        <Button onClick={() => handleChangeCredit(10)}>Get more credits</Button>
      </Card>
      <Button className='mt-5 mx-auto' onClick={() => window.history.back()}>
        Back
      </Button>
    </section>
  )
}

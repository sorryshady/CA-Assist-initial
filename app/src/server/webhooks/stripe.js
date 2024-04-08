import { emailSender } from 'wasp/server/email'
// const { TierIds } = require('../../shared/constants.js')
import express from 'express'
import Stripe from 'stripe'
// make sure the api version matches the version in the Stripe dashboard
const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2023-10-16', // TODO find out where this is in the Stripe dashboard and document
})

export const stripeWebhook = async (request, response, context) => {
  const sig = request.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
    console.table({
      sig: 'stripe webhook signature verified',
      type: event.type,
    })
  } catch (err) {
    console.log(err.message)
    return response.status(400).send(`Webhook Error: ${err.message}`)
  }

  let userStripeId = null

  try {
    console.log(event.type)
    if (event.type === 'checkout.session.completed') {
      console.log('Checkout session completed')
      const session = event.data.object
      userStripeId = session.customer

      const { line_items } = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ['line_items'],
        }
      )

      if (line_items?.data[0]?.price?.id === process.env.CREDIT_PRICE_ID) {
        console.log('Credits purchased ')
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            credits: 20,
          },
          // data: {
          //   hasPaid: true,
          //   datePaid: new Date(),
          //   subscriptionTier: TierIds.HOBBY,
          // },
        })
      } else if (
        line_items?.data[0]?.price?.id === process.env.SUBSCRIPTION_PRICE_ID
      ) {
        console.log('Premium subscription purchased ')
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            subscriptionStatus: true,
          },
          // data: {
          //   hasPaid: true,
          //   datePaid: new Date(),
          //   subscriptionTier: TierIds.PRO,
          // },
        })
      }
    } else if (event.type === 'invoice.paid') {
      const invoice = event.data.object
      const periodStart = new Date(invoice.period_start * 1000)
      await context.entities.User.updateMany({
        where: {
          stripeId: userStripeId,
        },
        // data: {
        //   hasPaid: true,
        //   datePaid: periodStart,
        // },
      })
    } else if (event.type === 'customer.subscription.updated') {
      const subscription = event.data.object
      userStripeId = subscription.customer
      if (subscription.status === 'active') {
        console.log('Subscription active ', userStripeId)
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            subscriptionStatus: true,
          },
        })
      }
      if (subscription.status === 'past_due') {
        console.log('Subscription past due: ', userStripeId)
        await context.entities.User.updateMany({
          where: {
            stripeId: userStripeId,
          },
          data: {
            subscriptionStatus: false,
          },
        })
      }
      if (subscription.cancel_at_period_end) {
        console.log('Subscription canceled at period end')
        let customer = await context.entities.User.findFirst({
          where: {
            stripeId: userStripeId,
          },
          select: {
            id: true,
            email: true,
          },
        })

        if (customer) {
          await context.entities.User.update({
            where: {
              id: customer.id,
            },
            data: {
              subscriptionStatus: false,
            },
          })

          if (customer.email) {
            await emailSender.send({
              to: customer.email,
              subject: 'We hate to see you go :(',
              text: 'We hate to see you go. Here is a sweet offer...',
              html: 'We hate to see you go. Here is a sweet offer...',
            })
          }
        }
      }
    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object
      userStripeId = subscription.customer
      console.log('Subscription deleted/ended')
      await context.entities.User.updateMany({
        where: {
          stripeId: userStripeId,
        },
        data: {
          // hasPaid: false,
          subscriptionStatus: false,
        },
      })
    } else {
      console.log(`Unhandled event type ${event.type}`)
    }

    response.json({ received: true })
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err?.message}`)
  }
}

// This allows us to override Wasp's defaults and parse the raw body of the request from Stripe to verify the signature
export const stripeMiddlewareFn = (middlewareConfig) => {
  console.log('middleware')
  middlewareConfig.delete('express.json')
  middlewareConfig.set('express.raw', express.raw({ type: 'application/json' }))
  return middlewareConfig
}

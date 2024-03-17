import { HttpError } from 'wasp/server'

export const updateCurrentUser = async (user, context) => {
  if (!user) {
    throw new HttpError(401, 'Unauthorized')
  }
  return context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: user,
  })
}

export const updateCredit = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized')
  }
  if (context.user.credits <= 0 && args.credits < 0) {
    throw new HttpError(400, 'Get more credits to continue messaging.')
  }
  return context.entities.User.update({
    where: { id: context.user.id },
    data: { credits: context.user.credits + args.credits },
  })
}

export const updateUserInfo = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized')
  }
  return context.entities.User.update({
    where: { id: context.user.id },
    data: args,
  })
}
export const updateSubscriberStatus = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized')
  }
  return context.entities.User.update({
    where: { id: context.user.id },
    data: { subscriptionStatus: args.subscriptionStatus },
  })
}

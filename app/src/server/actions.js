import { data } from 'autoprefixer'
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

export const updateUserLoginInfo = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Unauthorized')
  }

  // Check if the count of UserLogin records is less than 3
  const count = await context.entities.UserLogin.count()
  console.log(count)
  if (count < 3) {
    // Proceed with creating a new UserLogin record
    return context.entities.UserLogin.create({
      data: { ...args, user: { connect: { id: context.user.id } } },
    })
  } else {
    const oldestLogin = await context.entities.UserLogin.findFirst({
      orderBy: { createdAt: 'asc' },
    })
    await context.entities.UserLogin.delete({ where: { id: oldestLogin.id } })
    return context.entities.UserLogin.create({
      data: { ...args, user: { connect: { id: context.user.id } } },
    })
  }
}

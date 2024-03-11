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

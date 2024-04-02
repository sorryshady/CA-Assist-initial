export const getUserLoginHistory = async (args, context) => {
  return context.entities.UserLogin.findMany({
    where: { userId: context.user.id },
  })
}

export const getUserLoginRecord = async (args, context) => {
  return context.entities.UserLogin.findFirst({
    orderBy: { createdAt: 'desc' },
  })
}

import { faker } from '@faker-js/faker'

export function createRandomUser() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const panNumber =
    faker.string.alpha(5).toUpperCase() +
    faker.string.numeric(4) +
    faker.string.alpha(1).toUpperCase()

  const user = {
    firstName,
    lastName,
    panNumber,
    email: faker.internet.email({
      firstName,
      lastName,
    }),
    username: faker.internet.userName({
      firstName,
      lastName,
    }),
    createdAt: faker.date.between({
      from: new Date('2023-01-01'),
      to: new Date(),
    }),
    lastActiveTimestamp: faker.date.recent(),
    credits: faker.number.int({ min: 0, max: 3 }),
    primaryLang: faker.helpers.arrayElement([
      'english',
      'hindi',
      'malayalam',
      'tamil',
    ]),
    secondaryLang: faker.helpers.arrayElement([
      'english',
      'hindi',
      'malayalam',
      'tamil',
    ]),
    completeAccount: faker.helpers.arrayElement([true, false]),
  }
  return user
}

const USERS = faker.helpers.multiple(createRandomUser, { count: 50 })

export async function devSeedUsers(prismaClient) {
  try {
    await Promise.all(
      USERS.map(async (user) => {
        await prismaClient.user.create({
          data: user,
        })
      })
    )
  } catch (error) {
    console.error(error)
  }
}

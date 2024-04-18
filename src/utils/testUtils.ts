import { type UserSchema } from 'database/models/User'

interface UserCreationOptions {
  email?: string
  name?: string
  password?: string
}

export const setupTestUser = async (user: UserCreationOptions, login?: boolean): Promise<UserSchema> => {
  // this SHOULD be inferred from Hapi's handler where it is defined
  // but it is not...
  interface CopyOfDataFormat {
    statusCode: number
    result: {
      token: string
    }
  }

  const options = {
    method: 'POST',
    url: '/auth/register',
    payload: {
      name: 'Justin Reynard',
      email: 'justin@secretcowlevel.com',
      password: 'this.is.a.test.password',
      ...user,
    },
  }

  const data = (await globalThis.SERVER.inject(options)) as CopyOfDataFormat

  expect(data.statusCode).toBe(200)
  expect(data.result).toHaveProperty('token')

  if (login === true) {
    globalThis.tempToken = data.result.token
  }

  // get the user
  const foundUser = await globalThis.DB.models.User.findOne({ email: options.payload.email })
  expect(foundUser).toHaveProperty('name')
  expect(foundUser).toHaveProperty('email')
  expect(foundUser).toHaveProperty('password')

  return foundUser
}

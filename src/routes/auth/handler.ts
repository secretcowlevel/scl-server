import { type Request } from '@hapi/hapi'
import User from '../../database/models/User'
import { generateToken } from './utils'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  name: string
  password: string
}

interface LoginOrRegisterResponse {
  token: string
}

export const login = async (request: Request): Promise<LoginOrRegisterResponse> => {
  const { email, password } = request.payload as LoginPayload
  const user = await User.checkPasswordAndReturnUser(email, password)

  if (user === null) {
    throw new Error('User not found')
  }

  return {
    token: generateToken(user.getIdentifierAsString()),
  }
}

export const register = async (request: Request): Promise<LoginOrRegisterResponse> => {
  const { email, password, name } = request.payload as RegisterPayload

  const passwordHash = await User.hashPassword(password)

  const user = await User.create({
    name,
    email,
    password: passwordHash,
  })

  return {
    token: generateToken(user.getIdentifierAsString()),
  }
}

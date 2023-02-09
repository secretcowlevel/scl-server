import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { type Server } from '@hapi/hapi'
import Boom from '@hapi/boom'
import User from '../../database/models/User'

interface ValidateTokenResponse {
  isValid: boolean
}

interface DecodedToken {
  userId: number
}

export const generateToken = (userId: string): string => {
  // store a unique id per "session"
  const sessionId = uuidv4()
  const token = jwt.sign(
    {
      sessionId,
      userId,
    },
    process.env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '1 week',
    },
  )

  return token
}

const validateToken = async (decoded: DecodedToken): Promise<ValidateTokenResponse> => {
  const user = await User.findOne({ _id: decoded.userId })

  if (user === null) throw Boom.unauthorized()

  return { isValid: true }
}

export const setupAuthStrategies = (server: Server): void => {
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate: validateToken,
    urlKey: false, // do not allow token in query string
    verifyOptions: {
      algorithms: ['HS256'],
    },
  })

  server.auth.default('jwt')
}

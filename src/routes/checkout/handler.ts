import Boom from '@hapi/boom'
import { type Request } from '@hapi/hapi'
// import User from '../../database/models/User'
// import { generateToken } from './utils'

enum CheckoutType {
  STRIPE,
}

interface CheckoutPayload {
  checkoutType: CheckoutType
}

type CheckoutResponse = boolean

export const checkoutHandler = async (request: Request): Promise<CheckoutResponse> => {
  const { checkoutType } = request.payload as CheckoutPayload

  if (!process.env.STRIPE_SECRET_KEY) {
    throw Boom.badImplementation('missing stripe configuration')
  }

  switch (checkoutType) {
    case CheckoutType.STRIPE:
    default:
      break
  }

  return false
}

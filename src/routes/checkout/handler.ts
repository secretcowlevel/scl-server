import Boom from '@hapi/boom'
import { type Request } from '@hapi/hapi'
import { StoreItem } from 'database/models'

enum CheckoutType {
  STRIPE,
}

interface CheckoutPayload {
  checkoutType: CheckoutType
  items: Array<{
    sku: string
    quantity: number
  }>
}

type CheckoutResponse = boolean

// ** this is the POST, tells the server you INTEND to purchase this "cart" of items
export const checkoutHandler = async (request: Request): Promise<CheckoutResponse> => {
  const { checkoutType, items = [] } = request.payload as CheckoutPayload

  // first we need to make sure this purchase is good! Are the items available, etc
  // const x = await StoreItem.findOne()

  switch (checkoutType) {
    case CheckoutType.STRIPE:
      if (process.env.STRIPE_SECRET_KEY === undefined) {
        throw Boom.badImplementation('missing stripe configuration')
      }

      request.log('info', 'checkout with stripe')
      break
    default:
      throw Boom.badImplementation(`checkout type ${CheckoutType[checkoutType]} not implemented yet`)
  }

  return false
}

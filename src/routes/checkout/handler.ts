import Boom from '@hapi/boom'
import { type Request } from '@hapi/hapi'
// import Stripe from 'stripe'
// import { StoreItem } from 'database/models'

enum CheckoutType {
  STRIPE,
  STEAMWALLET,
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
  const { checkoutType /*, items = [] */ } = request.payload as CheckoutPayload

  /*
  const stripeData = {
    email: userDb.email.email,
    description: `Created by Doomtrooper for user ${userDb._id}`,
    metadata: {
      userId: userDb._id.toString(),
    },
  }

  if (!userDb.stripe) {
    global.log(['store', 'checkout', 'stripe', 'webhook'], `CREATING STRIPE CUSTOMER ${JSON.stringify(stripeData)}`)
    const customer = await stripe.customers.create(stripeData)

    userDb.stripe = {
      customerId: customer.id,
    }
    // will save below
  } else {
    global.log(['store', 'checkout', 'stripe', 'webhook'], `CREATING STRIPE CUSTOMER ${JSON.stringify(userDb.stripe)}`)
    await stripe.customers.update(userDb.stripe.customerId, stripeData)
  }
  */

  // const session = Stripe.Checkout.sessions.create({

  // })

  // first we need to make sure this purchase is good! Are the items available, etc
  // const x = await StoreItem.findOne()

  // next we need to calculate the total cost of the items in the array
  // items.forEach()

  // now we should compare the calculated total to the submitted total (TODO) to check for any fraud
  // and ensure the user is going to be charged the same amount from the previous step

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

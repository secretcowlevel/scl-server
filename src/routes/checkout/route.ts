import { type ServerRoute } from '@hapi/hapi'
import { checkoutHandler } from './handler'
import validation from './validation'

export default [
  {
    method: 'POST',
    path: '/checkout',
    handler: checkoutHandler,
    options: {
      description: 'Payment Processing',
      validate: validation.checkout,
      tags: ['api', 'store'],
      // response: {
      //   failAction: async (req, h, err) => {
      //     if (err) {
      //       console.log(err)
      //     }
      //   },
      // },
    },
  },
] as ServerRoute[]

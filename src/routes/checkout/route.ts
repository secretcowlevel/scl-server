import { type ServerRoute } from '@hapi/hapi'
import { checkout } from './handler'
import validation from './validation'

export default [
  {
    method: 'POST',
    path: '/checkout',
    handler: checkout,
    options: {
      description: 'Payment Processing',
      validate: validation.login,
      tags: ['api', 'store'],
    },
  },
] as ServerRoute[]

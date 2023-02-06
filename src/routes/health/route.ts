import { getHealth, getHealthJson } from './handler'
import { type ServerRoute } from '@hapi/hapi'
import { healthJson } from './schema'
import validation from './validation'

export default [
  {
    method: 'GET',
    path: '/health',
    handler: getHealth,
    options: {
      description: 'Health check on server API',
      auth: false,
      tags: ['api'],
    },
  },
  {
    method: 'GET',
    path: '/healthJson',
    handler: getHealthJson,
    options: {
      auth: false,
      description: 'Health check on server API',
      tags: ['api'],
      response: {
        schema: healthJson,
      },
      validate: validation.getHealthJson,
    },
  },
] as ServerRoute[]

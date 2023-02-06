import { type ServerRoute } from '@hapi/hapi'
import healthCheckRoutes from './health/route'
import authRoutes from './auth/route'

const routes: ServerRoute[] = [
  // unique modules
  ...authRoutes,
  ...healthCheckRoutes,
  // crud modules
  // temp index route
  {
    method: 'GET',
    path: '/',
    options: {
      auth: false,
    },
    handler: () => 'Hello World',
  },
  // temp private route
  {
    method: 'GET',
    path: '/private',
    options: {},
    handler: () => 'Successfully Authenticated',
  },
]

export default routes

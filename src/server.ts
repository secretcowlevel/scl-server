import Hapi, { type Server } from '@hapi/hapi'
import routes from './routes/index'
import { setupPlugins } from './plugins/'
import { setupAuthStrategies } from './routes/auth/utils'
import { init as dbInit } from './database/'
import { type Mongoose } from 'mongoose'

const server: Server = new Hapi.Server({
  port: 1337,
  host: '0.0.0.0',
  routes: {
    cors: true,
  },
})

interface ServerInit {
  db: Mongoose
  server: Server
}

export const init = async (): Promise<ServerInit> => {
  // setup plugins
  await setupPlugins(server)

  // setup database
  const db = await dbInit()

  // setup authentication
  setupAuthStrategies(server)

  // setup routes
  server.route(routes)

  // initialize the server
  await server.initialize()

  return { server, db }
}

export const start = async (): Promise<Server> => {
  await server.start()

  return server
}

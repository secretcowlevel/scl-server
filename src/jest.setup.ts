import 'dotenv/config'
import { init } from './server'

export default async (): Promise<void> => {
  const { server, db } = await init()
  globalThis.SERVER = server
  globalThis.DB = db
}

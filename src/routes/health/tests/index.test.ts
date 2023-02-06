import { type Server } from '@hapi/hapi'
import { init } from '../../../server'

let server: Server

beforeAll(async () => {
  server = await init()
})

afterAll(async () => {
  await server.stop()
})

test('/health should return a text string', async () => {
  const options = {
    method: 'GET',
    url: '/health',
  }
  const data = await server.inject(options)
  expect(data.statusCode).toBe(200)
  expect(data.result).toBe('Healthy!')
})

test('/healthJson should return a JSON object', async () => {
  const options = {
    method: 'GET',
    url: '/healthJson',
  }
  const data = await server.inject(options)
  expect(data.statusCode).toBe(200)
  expect(data.result).toHaveProperty('healthy', true)
  expect(data.result).toHaveProperty('userCount', 0)
})

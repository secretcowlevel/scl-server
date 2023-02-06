import { type Server } from '@hapi/hapi'
import User from '../../../database/models/User'
import { init } from '../../../server'

// import { User } from '../../../database/models/user'
let server: Server

let tempToken: string

beforeAll(async () => {
  server = await init()
})

afterAll(async () => {
  await server.stop()
  await User.deleteOne({ email: 'justin@secretcowlevel.com' })
})

describe('POST /auth/register', () => {
  it('should return 400 error if name is missing', async () => {
    const options = {
      method: 'POST',
      url: '/auth/register',
      payload: {
        email: 'banana@banana.com',
        password: 'this.is.a.test.password',
      },
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(400)
  })

  it('should return 400 error if email is missing', async () => {
    const options = {
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'banana@banana.com',
        password: 'this.is.a.test.password',
      },
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(400)
  })

  it('should return 400 error if password is missing', async () => {
    const options = {
      method: 'POST',
      url: '/auth/register',
      payload: {
        email: 'banana@banana.com',
        name: 'Banana Bananan',
      },
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(400)
  })

  it('should return 200 if valid registration is passed', async () => {
    const options = {
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Justin Reynard',
        email: 'justin@secretcowlevel.com',
        password: 'this.is.a.test.password',
      },
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(200)
    expect(data.result).toHaveProperty('token')
  })
})

describe('POST /auth/login', () => {
  it('POST /auth/login should reject requests without an email', async () => {
    const options = {
      method: 'POST',
      url: '/auth/login',
      payload: {
        password: 'banana',
      },
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(400)
  })

  it('POST /auth/login should reject requests without a password', async () => {
    const options = {
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'banana@banana.com',
      },
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(400)
  })

  it('POST /auth/login should accept a valid email/password combo but return an error if user isnt found', async () => {
    const options = {
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'banana@secretcowlevel.com',
        password: 'this.is.a.test.password',
      },
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(400)
  })

  it('POST /auth/login should accept a valid email/password combo and return their token if they are correct', async () => {
    const options = {
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'justin@secretcowlevel.com',
        password: 'this.is.a.test.password',
      },
    }

    // this SHOULD be inferred from Hapi's handler where it is defined
    // but it is not...
    interface CopyOfDataFormat {
      statusCode: number
      result: {
        token: string
      }
    }
    const data = (await server.inject(options)) as CopyOfDataFormat

    expect(data.statusCode).toBe(200)
    expect(data.result).toHaveProperty('token')
    tempToken = data?.result?.token
  })
})

describe('GET /private', () => {
  it('should return unauthorized error if no header is specified', async () => {
    const options = {
      method: 'GET',
      url: '/private',
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(401)
  })

  it('should return some info with a proper token', async () => {
    const options = {
      method: 'GET',
      url: '/private',
      headers: { authorization: `Bearer ${tempToken}` },
    }
    const data = await server.inject(options)
    expect(data.statusCode).toBe(200)
  })
})

const setupTestUser = async (): Promise<void> => {
  // this SHOULD be inferred from Hapi's handler where it is defined
  // but it is not...
  interface CopyOfDataFormat {
    statusCode: number
    result: {
      token: string
    }
  }

  const options = {
    method: 'POST',
    url: '/auth/register',
    payload: {
      name: 'Justin Reynard',
      email: 'justin@secretcowlevel.com',
      password: 'this.is.a.test.password',
    },
  }
  const data = (await globalThis.SERVER.inject(options)) as CopyOfDataFormat
  expect(data.statusCode).toBe(200)
  expect(data.result).toHaveProperty('token')
  globalThis.tempToken = data.result.token
}

beforeAll(async () => {
  // create an item thats instock
  const activeItem = await globalThis.DB.models.StoreItem.create({
    name: 'active item',
    sku: 'active-item',
    active: true,
  })

  await activeItem.save()

  // create an item thats out of stock
  const inactiveItem = await globalThis.DB.models.StoreItem.create({
    name: 'inactive item',
    sku: 'inactive-item',
    active: false,
  })

  await inactiveItem.save()

  // create a test user
  await setupTestUser()
})

afterAll(async () => {
  await globalThis.DB.models.StoreItem.deleteMany({})
  await globalThis.DB.models.User.deleteMany({ email: 'justin@secretcowlevel.com' })
})

describe('Checkout Module', () => {
  describe('POST /checkout (unauthenticated)', () => {
    it('should return 401 error if unauthenticated', async () => {
      const options = {
        method: 'POST',
        url: '/checkout',
        payload: {},
      }
      const data = await globalThis.SERVER.inject(options)
      expect(data.statusCode).toBe(401)
    })
  })

  describe('POST /checkout (authenticated)', () => {
    it('should return 400 error if checkoutType is missing', async () => {
      const options = {
        method: 'POST',
        url: '/checkout',
        headers: { authorization: `Bearer ${globalThis.tempToken}` },
      }
      const data = await globalThis.SERVER.inject(options)
      expect(data.statusCode).toBe(400)
    })
  })
})

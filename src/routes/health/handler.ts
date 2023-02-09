import { type Request, type ResponseToolkit, type ResponseObject } from '@hapi/hapi'
import User from '../../database/models/User'

export const getHealth = (request: Request, h: ResponseToolkit): ResponseObject => {
  return h.response('Healthy!')
}

interface HealthJSON {
  healthy: boolean
  userCount: number
}

export const getHealthJson = async (): Promise<HealthJSON> => {
  const userCount = await User.count({})

  return {
    healthy: true,
    userCount,
  }
}

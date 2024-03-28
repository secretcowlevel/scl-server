import { type Request, type ResponseToolkit, type ResponseObject } from '@hapi/hapi'
import User from '../../database/models/User'
import StoreItem from '../../database/models/StoreItem'

export const getHealth = (request: Request, h: ResponseToolkit): ResponseObject => {
  return h.response('Healthy!')
}

interface HealthJSON {
  healthy: boolean
  userCount: number
  storeItemCount: number
}

export const getHealthJson = async (): Promise<HealthJSON> => {
  const userCount = await User.countDocuments()
  const storeItemCount = await StoreItem.countDocuments()

  return {
    healthy: true,
    userCount,
    storeItemCount,
  }
}

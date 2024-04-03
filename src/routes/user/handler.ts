import { type ResponseToolkit, type Request } from '@hapi/hapi'
import User from '../../database/models/User'

export interface UserResponse {
  name: string
  email: string
}

export const getOneUser = async (request: Request, h: ResponseToolkit): Promise<UserResponse> => {
  // TODO - what is the right way to type this without using "as" ?
  const requestingUser = await User.validateAndGetUserById(request.auth.credentials.userId)
  const user = await User.validateAndGetUserById(request.params.userid as string, requestingUser)

  return await user.toJSON()
}

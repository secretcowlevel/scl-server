import { type Model, Schema, model, type Types, type HydratedDocument } from 'mongoose'
import 'dotenv'
import Boom from '@hapi/boom'
import bcrypt from 'bcrypt'

// *************************************
// * Interface - Values
interface IUser {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
}

// *************************************
// * Interface Methods
interface IUserMethods {
  // methods!
  getIdentifierAsString: () => string
}

// *************************************
// * Interface - UserModel defines the statics
interface UserModel extends Model<IUser, unknown, IUserMethods> {
  checkPassword: (plainTextPassword: string, hash: string) => Promise<boolean>
  checkPasswordAndReturnUser: (email: string, password: string) => Promise<HydratedDocument<IUser, IUserMethods> | null>
  hashPassword: (plainTextPassword: string) => Promise<string>
}

// *************************************
// * Schema definition!
const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
})

// *************************************
// * Method - getNumericIdentifier
userSchema.methods.getIdentifierAsString = function () {
  return this._id.toString()
}

// *************************************
// * Static - check Password
userSchema.statics.checkPassword = async function (plainTextPassword: string, hash: string) {
  return await bcrypt.compare(plainTextPassword, hash)
}

// *************************************
// * Static - check Password and return user
userSchema.statics.checkPasswordAndReturnUser = async function (
  email: string,
  plainTextPassword: string,
): Promise<HydratedDocument<IUser, IUserMethods>> {
  const userDb = await this.findOne({ email })
  if (userDb === null) throw Boom.badRequest('User not found')

  const passwordIsValid = await User.checkPassword(plainTextPassword, userDb.password)
  if (!passwordIsValid) throw Boom.badRequest('Password is incorrect')

  return userDb
}

// *************************************
// * Static - hash password
userSchema.statics.hashPassword = async function (plainTextPassword: string): Promise<string> {
  const saltRounds = 10

  return await bcrypt.hash(plainTextPassword, saltRounds)
}

// *************************************
// * Model definition
const User = model<IUser, UserModel>('User', userSchema)

export default User

import mongoose, { type Mongoose } from 'mongoose'

const init = async (): Promise<Mongoose> => {
  try {
    if (globalThis.DB !== undefined) {
      return globalThis.DB
    } else {
      console.log('CONNECTED TO MONGODB') // eslint-disable-line no-console
      await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
    }
  } catch (error) {
    console.error(`Unable to connect to the database`, error) // eslint-disable-line no-console
  }

  return mongoose
}

export { init, mongoose as db }

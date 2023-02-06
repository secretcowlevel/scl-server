import mongoose from 'mongoose'

const init = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
  } catch (error) {
    console.error(`Unable to connect to the database`, error) // eslint-disable-line no-console
  }
}

export { init }

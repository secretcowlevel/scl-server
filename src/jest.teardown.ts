import 'dotenv/config'

export default async (): Promise<void> => {
  await globalThis.DB.disconnect()
  await globalThis.SERVER.stop()
}

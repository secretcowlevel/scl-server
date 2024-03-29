import type PluginArray from '../types/plugin-array'
import PluginsBase from './plugins-base'
import PluginsDev from './plugins-dev'
import { type Server } from '@hapi/hapi'

export const setupPlugins = async (server: Server): Promise<void> => {
  const plugins: PluginArray = process.env.NODE_ENV === 'production' ? PluginsBase : [...PluginsBase, ...PluginsDev]

  await server.register(plugins)
}

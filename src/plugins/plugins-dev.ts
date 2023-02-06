import type PluginArray from '../types/plugin-array'
import hapiswagger from 'hapi-swagger'
import inert from '@hapi/inert'
import { swaggerOptions } from '../swagger/config'
import vision from '@hapi/vision'

const plugins: PluginArray = [
  {
    plugin: inert,
  },
  {
    plugin: vision,
  },
  {
    plugin: hapiswagger,
    options: swaggerOptions,
  },
]

export default plugins

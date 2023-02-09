import HapiAuthJwt2 from 'hapi-auth-jwt2'
import HapiPino from 'hapi-pino'
import type PluginArray from '../types/plugin-array'

const plugins: PluginArray = [{ plugin: HapiAuthJwt2 }]

if (process.env.NODE_ENV !== 'test') {
  plugins.push({
    plugin: HapiPino,
    options: {
      // Redact Authorization headers, see https://getpino.io/#/docs/redaction
      redact: ['req.headers.authorization'],
    },
  })
}

export default plugins

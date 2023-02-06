import Joi from 'joi'

export default {
  getHealth: {
    // TODO
  },
  getHealthJson: {
    query: Joi.object({
      limit: Joi.number().integer().min(1).max(1000),
    }),
  },
}

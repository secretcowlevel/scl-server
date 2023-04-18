import Joi from 'joi'

export default {
  login: {
    payload: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  register: {
    payload: Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
}

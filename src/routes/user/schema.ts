import Joi from 'joi'

export const userSchema = Joi.object()
  .keys({
    name: Joi.string(),
    email: Joi.string(),
  })
  .label('User Schema')

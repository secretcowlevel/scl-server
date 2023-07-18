import Joi from 'joi'

export default {
  checkout: {
    payload: Joi.object({
      checkoutType: Joi.string().required(),
      items: Joi.array().items(
        Joi.object({
          sku: Joi.string().required(),
          quantity: Joi.number().required(),
        }),
      ),
    }),
  },
}

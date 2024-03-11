import Joi from "joi";

import { generalValidationRules } from "../../utils/generalValidationRules.js";

export const createOrderSchema = Joi.object({
  productId: generalValidationRules.dbId.required(),
  quantity: Joi.number().required(),
  shippingAddress: Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required(),
  }),
  couponId: Joi.string(),
  paymentMethod: Joi.string().valid("cash", "stripe", "paymob").required(),
  phoneNumbers: Joi.array().items(Joi.string().required()),
  generalValidationRules,
});

export const convertCartToOrderSchema = Joi.object({
  couponId: Joi.string(),
  paymentMethod: Joi.string().valid("cash", "stripe", "paymob").required(),
  generalValidationRules,
});

export const getOrdersSchema = Joi.object({
  generalValidationRules,
});

export const getOrderSchema = Joi.object({
  orderId: Joi.string().required(),
  generalValidationRules,
});

export const deliverOrderSchema = Joi.object({
  orderId: Joi.string().required(),
  generalValidationRules,
});

export const payStripeSchema = Joi.object({
  orderId: Joi.string().required(),
  generalValidationRules,
});

export const refundOrderSchema = Joi.object({
  orderId: Joi.string().required(),
  generalValidationRules,
});

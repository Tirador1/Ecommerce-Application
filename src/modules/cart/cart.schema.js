import Joi from "joi";

import { generalValidationRules } from "../../utils/generalValidationRules.js";

export const addtoCartSchema = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
  }),
  generalValidationRules,
};

export const removeFromCartSchema = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const getCartSchema = {
  body: Joi.object().keys({}),
  generalValidationRules,
};

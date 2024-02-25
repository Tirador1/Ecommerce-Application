import Joi from "joi";

import { generalValidationRules } from "../../utils/generalValidationRules.js";

export const createProductSchema = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    discount: Joi.number().required(),
    quantity: Joi.number().required(),
    rating: Joi.number().required(),
    specifications: Joi.string().required(),
  }),
  params: Joi.object().keys({
    brandId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const updateProductSchema = {
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    price: Joi.number(),
    discount: Joi.number(),
    quantity: Joi.number(),
    rating: Joi.number(),
    specifications: Joi.string(),
  }),
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const deleteProductSchema = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const getProductSchema = {
  params: Joi.object().keys({
    brandId: Joi.string().required(),
  }),
  generalValidationRules,
};

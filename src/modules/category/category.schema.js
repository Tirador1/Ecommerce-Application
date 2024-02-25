import Joi from "joi";

import { generalValidationRules } from "../../utils/generalValidationRules.js";

export const createCategorySchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
  generalValidationRules,
};

export const updateCategorySchema = {
  body: Joi.object().keys({
    name: Joi.string(),
  }),
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const deleteCategorySchema = {
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
  generalValidationRules,
};

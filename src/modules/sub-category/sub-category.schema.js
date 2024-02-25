import Joi from "joi";

import { generalValidationRules } from "../../utils/generalValidationRules.js";

export const createSubCategorySchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
  params: Joi.object().keys({
    categoryId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const updateSubCategorySchema = {
  body: Joi.object().keys({
    name: Joi.string(),
    categoryId: Joi.string(),
  }),
  params: Joi.object().keys({
    subCategoryId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const deleteSubCategorySchema = {
  params: Joi.object().keys({
    subCategoryId: Joi.string().required(),
  }),
  generalValidationRules,
};

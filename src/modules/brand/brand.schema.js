import Joi from "joi";

import { generalValidationRules } from "../../utils/generalValidationRules.js";

export const createBrandSchema = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
  params: Joi.object().keys({
    subCategoryId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const updateBrandSchema = {
  body: Joi.object().keys({
    name: Joi.string(),
  }),
  params: Joi.object().keys({
    brandId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const deleteBrandSchema = {
  params: Joi.object().keys({
    brandId: Joi.string().required(),
  }),
  generalValidationRules,
};

export const getBrandSchema = {
  params: Joi.object().keys({
    subCategoryId: Joi.string().required(),
  }),
  generalValidationRules,
};

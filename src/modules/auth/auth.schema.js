import Joi from "joi";

import { generalValidationRules } from "../../utils/generalValidationRules.js";

export const signUpSchema = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phoneNumbers: Joi.array().items(Joi.string()).required(),
    addresses: Joi.array().items(Joi.string()).required(),
    role: Joi.string(),
    age: Joi.number().required(),
  }),
  generalValidationRules,
};

export const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  generalValidationRules,
};

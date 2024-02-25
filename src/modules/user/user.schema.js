import Joi from "joi";

import { generalValidationRules } from "../../utils/generalValidationRules.js";

export const updateUserProfileSchema = {
  body: Joi.object().keys({
    username: Joi.string(),
    email: Joi.string(),
    phoneNumbers: Joi.array().items(Joi.string()).required(),
    addresses: Joi.array().items(Joi.string()).required(),
    age: Joi.number(),
    role: Joi.string(),
  }),
  generalValidationRules,
};

export const updateEmailSchema = {
  body: Joi.object().keys({
    email: Joi.string().required(),
  }),
  generalValidationRules,
};

export const updatePasswordSchema = {
  body: Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
  generalValidationRules,
};

export const deleteUserSchema = {
  body: Joi.object().keys({
    password: Joi.string().required(),
  }),
  generalValidationRules,
};

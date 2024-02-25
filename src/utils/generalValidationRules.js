import Joi from "joi";
import { Types } from "mongoose";

const objectIdValidation = (value, helpers) => {
  const isValidObjectId = Types.ObjectId.isValid(value);
  return isValidObjectId ? value : helpers.error("Invalid ObjectId");
};

export const generalValidationRules = {
  headerRules: Joi.object({
    "user-agent": Joi.string().required(),
    "postman-token": Joi.string(),
    "content-type": Joi.string(),
    "accept-encoding": Joi.string(),
    "cache-control": Joi.string(),
    accept: Joi.string(),
    host: Joi.string(),
    "accept-language": Joi.string(),
    cookie: Joi.string(),
    connection: Joi.string(),
    "content-length": Joi.string(),
  }),
  dbId: Joi.string().custom(objectIdValidation),
};

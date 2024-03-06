import Joi from "joi";

import { generalValidationRules } from "../../utils/generalValidationRules.js";

export const addCouponSchema = {
  body: Joi.object({
    code: Joi.string().required().min(3).max(10).alphanum(),
    isFixed: Joi.boolean(),
    isPrecentage: Joi.boolean(),
    discount: Joi.number().required().min(1),
    maxDiscount: Joi.number().required().min(1),
    validFrom: Joi.date()
      .greater(Date.now() - 24 * 60 * 60 * 1000)
      .required(),
    validTill: Joi.date().greater(Joi.ref("validFrom")).required(),
    Users: Joi.array().items(
      Joi.object({
        userId: generalValidationRules.dbId.required(),
        maxUsage: Joi.number().required().min(1),
      })
    ),
  }),
  generalValidationRules,
};

export const validteCoupon = {
  generalValidationRules,
};

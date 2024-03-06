import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as Coupon from "./coupon.controller.js";
import * as couponSchema from "./coupon.schema.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { endPointsRoles } from "./coupon.endpoints.js";

const router = Router();

router.post(
  "/addCoupon",
  authMiddleware(endPointsRoles.AddCoupon),
  validationMiddleware(couponSchema.addCouponSchema),
  expressAsyncHandler(Coupon.addCoupon)
);

router.post(
  "/valid",
  authMiddleware(endPointsRoles.validteCoupon),
  expressAsyncHandler(Coupon.validteCoupon)
);

export default router;

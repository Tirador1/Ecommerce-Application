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

router.get(
  "/validCoupons",
  authMiddleware(endPointsRoles.GetCoupons),
  expressAsyncHandler(Coupon.getAllValidCoupons)
);

router.get(
  "/disalbedCoupons",
  authMiddleware(endPointsRoles.GetCoupons),
  expressAsyncHandler(Coupon.getAllDisabledCoupons)
);

router.get(
  "/getByFeatures",
  authMiddleware(endPointsRoles.GetCoupons),
  expressAsyncHandler(Coupon.GetCouponsByFeatures)
);

router.get(
  "/:couponId",
  authMiddleware(endPointsRoles.GetCoupons),
  expressAsyncHandler(Coupon.GetCouponById)
);

router.put(
  "/changeCouponStatus/:couponId",
  authMiddleware(endPointsRoles.changeCouponStatus),
  expressAsyncHandler(Coupon.changeCouponStatus)
);

export default router;

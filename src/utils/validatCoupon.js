import Coupon from "../../DB/models/coupon.model.js";
import CouponUsers from "../../DB/models/coupon-users.model.js";
import { DateTime } from "luxon";

export async function applyCouponValidation(code, userId) {
  const coupon = await Coupon.findOne({ code });
  if (!coupon) return { msg: "CouponCode is invalid", status: 400 };

  if (
    coupon.couponStatus == "expired" ||
    DateTime.fromISO(coupon.validTill) < DateTime.now()
  )
    return { msg: "this coupon is  expired", status: 400 };

  if (DateTime.now() < DateTime.fromISO(coupon.validFrom))
    return { msg: "this coupon is not started yet", status: 400 };

  const isUserAssgined = await CouponUsers.findOne({
    couponId: coupon._id,
    userId,
  });
  if (!isUserAssgined)
    return { msg: "this coupon is not assgined to you", status: 400 };

  if (isUserAssgined.maxUsage <= isUserAssgined.usageCount)
    return {
      msg: "you have exceed the usage count for this coupon",
      status: 400,
    };

  return coupon;
}

import { scheduleJob } from "node-schedule";

import Coupon from "../../DB/models/coupon.model.js";
import { DateTime } from "luxon";

export const scheduleCouponExpiry = async () => {
  scheduleJob("* /5 * * *", async () => {
    const coupons = await Coupon.find({ couponStatus: "valid" });

    for (const coupon of coupons) {
      if (DateTime.fromISO(coupon.validTill) < DateTime.now()) {
        coupon.couponStatus = "expired";
        await coupon.save();
      }
    }
  });
};

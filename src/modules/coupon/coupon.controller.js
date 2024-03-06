import Coupon from "../../../DB/models/coupon.model.js";
import CouponUsers from "../../../DB/models/coupon-users.model.js";
import User from "../../../DB/models/user.model.js";

import { applyCouponValidation } from "../../utils/validatCoupon.js";

export const addCoupon = async (req, res, next) => {
  const {
    code,
    isFixed,
    isPrecentage,
    discount,
    maxDiscount,
    validFrom,
    validTill,
    Users,
  } = req.body;

  const { _id } = req.user;

  const isCouponExist = await Coupon.findOne({
    code,
  });

  if (isCouponExist) {
    return next({ message: "coupon already exist", cause: 400 });
  }

  if (isFixed && isPrecentage) {
    return next({ message: "select only one discount type", cause: 400 });
  }

  if (isFixed && discount > maxDiscount) {
    return next({
      message: "discount should be less than max discount",
      cause: 400,
    });
  }

  if (isPrecentage && discount > 100) {
    return next({ message: "discount should be less than 100%", cause: 400 });
  }

  if (validFrom > validTill) {
    return next({
      message: "valid till should be greater than valid from",
      cause: 400,
    });
  }

  const newCoupon = await Coupon.create({
    code,
    isFixed,
    isPrecentage,
    discount,
    maxDiscount,
    validFrom,
    validTill,
    addedBy: _id,
  });

  const userIds = [];
  for (const user of Users) {
    userIds.push(user.userId);
  }

  const isUsersExist = await User.find({ _id: { $in: userIds } });

  if (isUsersExist.length !== userIds.length) {
    return next({ message: "user not found", cause: 404 });
  }

  if (userIds.length > 0) {
    for (const user of Users) {
      const isUserCouponExist = await CouponUsers.findOne({
        userId: user.userId,
        couponId: newCoupon._id,
      });

      if (isUserCouponExist) {
        return next({ message: "user already assigned", cause: 400 });
      }

      await CouponUsers.create({
        userId: user.userId,
        couponId: newCoupon._id,
        maxUsage: user.maxUsage,
      });
    }
  }

  return res.status(201).json({ message: "coupon added", newCoupon });
};

export const validteCoupon = async (req, res, next) => {
  const { code } = req.body;
  const { _id } = req.user;

  const isCouponValid = await applyCouponValidation(code, _id);

  if (isCouponValid.status) {
    return next({ cause: isCouponValid.status, message: isCouponValid.msg });
  }

  return res.status(200).json({ message: "coupon is valid", isCouponValid });
};

import { systemRoles } from "../../utils/systemRoles.js";

export const endPointsRoles = {
  AddCoupon: [systemRoles.SUPERADMIN, systemRoles.ADMIN, systemRoles.USER],
  validteCoupon: [systemRoles.SUPERADMIN, systemRoles.ADMIN, systemRoles.USER],
  GetCoupons: [systemRoles.SUPERADMIN, systemRoles.ADMIN, systemRoles.USER],
  changeCouponStatus: [systemRoles.SUPERADMIN, systemRoles.ADMIN],
};

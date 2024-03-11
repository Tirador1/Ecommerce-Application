import { systemRoles } from "../../utils/systemRoles.js";

export const endPointsRoles = {
  CREATE_ORDER: [systemRoles.SUPERADMIN, systemRoles.ADMIN, systemRoles.USER],
  CONVERT_CART_TO_ORDER: [
    systemRoles.SUPERADMIN,
    systemRoles.ADMIN,
    systemRoles.USER,
  ],
  GET_ORDERS: [systemRoles.SUPERADMIN, systemRoles.ADMIN, systemRoles.USER],
  GET_ORDER: [systemRoles.SUPERADMIN, systemRoles.ADMIN, systemRoles.USER],
  DELIVER_ORDER: [systemRoles.DELEVRY_AGENT],
  PAY_ORDER: [systemRoles.SUPERADMIN, systemRoles.ADMIN, systemRoles.USER],
  REFUND_ORDER: [systemRoles.SUPERADMIN, systemRoles.ADMIN],
};

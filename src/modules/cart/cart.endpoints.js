import { systemRoles } from "../../utils/systemRoles.js";

export const endPointsRoles = {
  ADD_CART: [systemRoles.SUPERADMIN, systemRoles.ADMIN, systemRoles.USER],
  REMOVE_FROM_CART: [
    systemRoles.SUPERADMIN,
    systemRoles.ADMIN,
    systemRoles.USER,
  ],
  GET_CART: [systemRoles.SUPERADMIN, systemRoles.ADMIN, systemRoles.USER],
};

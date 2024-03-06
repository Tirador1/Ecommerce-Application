import { systemRoles } from "../../utils/systemRoles.js";

export const endPointsRoles = {
  ADD_BRAND: [systemRoles.SUPERADMIN, systemRoles.ADMIN],
  UPDATE_BRAND: [systemRoles.SUPERADMIN, systemRoles.ADMIN],
  DELETE_BRAND: [systemRoles.SUPERADMIN, systemRoles.ADMIN],
  GET_BRANDS: [systemRoles.ADMIN, systemRoles.SUPERADMIN, systemRoles.USER],
  GET_BRAND_BY_CATEGORY: [
    systemRoles.ADMIN,
    systemRoles.SUPERADMIN,
    systemRoles.USER,
  ],
};

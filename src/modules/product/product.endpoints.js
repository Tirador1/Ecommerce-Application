import { systemRoles } from "../../utils/systemRoles.js";

export const endPointsRoles = {
  ADD_PRODUCT: [systemRoles.SUPERADMIN, systemRoles.ADMIN],
  UPDATE_PRODUCT: [systemRoles.SUPERADMIN, systemRoles.ADMIN],
  DELETE_PRODUCT: [systemRoles.SUPERADMIN, systemRoles.ADMIN],
  GET_PRODUCTS: [systemRoles.ADMIN, systemRoles.SUPERADMIN, systemRoles.USER],
};

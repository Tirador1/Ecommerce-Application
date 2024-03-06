import { systemRoles } from "../../utils/systemRoles.js";

export const endPointsRoles = {
  ADD_SUB_CATEGORY: [systemRoles.SUPERADMIN],
  UPDATE_SUB_CATEGORY: [systemRoles.SUPERADMIN],
  DELETE_SUB_CATEGORY: [systemRoles.SUPERADMIN],
  GET_SUB_CATEGORIES: [systemRoles.ADMIN, systemRoles.SUPERADMIN],
  GET_SUB_CATEGORY: [systemRoles.ADMIN, systemRoles.SUPERADMIN],
};

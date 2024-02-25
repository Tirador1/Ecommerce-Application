import { systemRoles } from "../../utils/systemRoles.js";

export const endPointsRoles = {
  ADD_CATEGORY: [systemRoles.SUPERADMIN],
  UPDATE_CATEGORY: [systemRoles.SUPERADMIN],
  DELETE_CATEGORY: [systemRoles.SUPERADMIN],
  GET_CATEGORIES: [systemRoles.ADMIN, systemRoles.SUPERADMIN],
};

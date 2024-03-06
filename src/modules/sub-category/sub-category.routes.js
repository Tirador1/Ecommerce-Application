import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as subCategory from "./sub-category.controller.js";
import * as authSchema from "./sub-category.schema.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { allowedExtesions } from "../../utils/allowedExtesions.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { endPointsRoles } from "./sub-category.endpoints.js";
import { multerMiddlewareHost } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/:categoryId",
  authMiddleware(endPointsRoles.ADD_SUB_CATEGORY),
  multerMiddlewareHost(allowedExtesions.image).single("image"),
  validationMiddleware(authSchema.createSubCategorySchema),
  expressAsyncHandler(subCategory.createSubCategory)
);

router.put(
  "/:subCategoryId",
  authMiddleware(endPointsRoles.UPDATE_SUB_CATEGORY),
  multerMiddlewareHost(allowedExtesions.image).single("image"),
  validationMiddleware(authSchema.updateSubCategorySchema),
  expressAsyncHandler(subCategory.updateSubCategory)
);

router.delete(
  "/:subCategoryId",
  authMiddleware(endPointsRoles.DELETE_SUB_CATEGORY),
  validationMiddleware(authSchema.deleteSubCategorySchema),
  expressAsyncHandler(subCategory.deleteSubCategory)
);

router.get(
  "/:categoryId",
  authMiddleware(endPointsRoles.GET_SUB_CATEGORIES),
  expressAsyncHandler(subCategory.getSubCategories)
);

router.get(
  "/:subCategoryId",
  authMiddleware(endPointsRoles.GET_SUB_CATEGORY),
  expressAsyncHandler(subCategory.getSubCategory)
);

export default router;

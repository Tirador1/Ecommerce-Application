import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as categoryController from "./category.controller.js";
import * as authSchema from "./category.schema.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { allowedExtesions } from "../../utils/allowedExtesions.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { endPointsRoles } from "./category.endpoints.js";
import { multerMiddlewareHost } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/",
  authMiddleware(endPointsRoles.ADD_CATEGORY),
  multerMiddlewareHost(allowedExtesions.image).single("image"),
  validationMiddleware(authSchema.createCategorySchema),
  expressAsyncHandler(categoryController.createCategory)
);

router.put(
  "/:categoryId",
  authMiddleware(endPointsRoles.UPDATE_CATEGORY),
  multerMiddlewareHost(allowedExtesions.image).single("image"),
  validationMiddleware(authSchema.updateCategorySchema),
  expressAsyncHandler(categoryController.updateCategory)
);

router.delete(
  "/:categoryId",
  authMiddleware(endPointsRoles.DELETE_CATEGORY),
  validationMiddleware(authSchema.deleteCategorySchema),
  expressAsyncHandler(categoryController.deleteCategory)
);

router.get(
  "/",
  authMiddleware(endPointsRoles.GET_CATEGORIES),
  expressAsyncHandler(categoryController.getCategories)
);

export default router;

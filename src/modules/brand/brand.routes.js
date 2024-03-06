import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as Brand from "./brand.controller.js";
import * as authSchema from "./brand.schema.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { allowedExtesions } from "../../utils/allowedExtesions.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { endPointsRoles } from "./brand.endpoints.js";
import { multerMiddlewareHost } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/:subCategoryId",
  authMiddleware(endPointsRoles.ADD_BRAND),
  multerMiddlewareHost(allowedExtesions.image).single("image"),
  validationMiddleware(authSchema.createBrandSchema),
  expressAsyncHandler(Brand.createBrand)
);

router.put(
  "/:brandId",
  authMiddleware(endPointsRoles.UPDATE_BRAND),
  multerMiddlewareHost(allowedExtesions.image).single("image"),
  validationMiddleware(authSchema.updateBrandSchema),
  expressAsyncHandler(Brand.updateBrand)
);

router.delete(
  "/:brandId",
  authMiddleware(endPointsRoles.DELETE_BRAND),
  validationMiddleware(authSchema.deleteBrandSchema),
  expressAsyncHandler(Brand.deleteBrand)
);

router.get(
  "/:subCategoryId",
  authMiddleware(endPointsRoles.GET_BRANDS),
  validationMiddleware(authSchema.getBrandSchema),
  expressAsyncHandler(Brand.getBrandsBySubCategory)
);

router.get(
  "/:categoryId",
  authMiddleware(endPointsRoles.GET_BRANDS),
  validationMiddleware(authSchema.getBrandByCategorySchema),
  expressAsyncHandler(Brand.getBrandsByCategory)
);

export default router;

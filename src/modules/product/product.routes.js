import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as Product from "./product.controller.js";
import * as authSchema from "./product.schema.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { allowedExtesions } from "../../utils/allowedExtesions.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { endPointsRoles } from "./product.endpoints.js";
import { multerMiddlewareHost } from "../../middlewares/multer.js";

const router = Router();

router.post(
  "/:brandId",
  authMiddleware(endPointsRoles.ADD_PRODUCT),
  multerMiddlewareHost(allowedExtesions.image).array("images", 3),
  validationMiddleware(authSchema.createProductSchema),
  expressAsyncHandler(Product.createProduct)
);

router.put(
  "/:productId",
  authMiddleware(endPointsRoles.UPDATE_PRODUCT),
  multerMiddlewareHost(allowedExtesions.image).array("images", 3),
  validationMiddleware(authSchema.updateProductSchema),
  expressAsyncHandler(Product.updateProduct)
);

router.delete(
  "/:productId",
  authMiddleware(endPointsRoles.DELETE_PRODUCT),
  validationMiddleware(authSchema.deleteProductSchema),
  expressAsyncHandler(Product.deleteProduct)
);

router.get(
  "/:brandId",
  authMiddleware(endPointsRoles.GET_PRODUCTS),
  validationMiddleware(authSchema.getProductSchema),
  expressAsyncHandler(Product.getAllProducts)
);

export default router;

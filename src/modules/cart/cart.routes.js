import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as Cart from "./cart.controller.js";
import * as cartSchema from "./cart.schema.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { endPointsRoles } from "./cart.endpoints.js";

const router = Router();

router.post(
  "/addtoCart",
  authMiddleware(endPointsRoles.ADD_CART),
  validationMiddleware(cartSchema.addtoCartSchema),
  expressAsyncHandler(Cart.addtoCart)
);

router.delete(
  "/removeFromCart/:cartId",
  authMiddleware(endPointsRoles.REMOVE_FROM_CART),
  validationMiddleware(cartSchema.removeFromCartSchema),
  expressAsyncHandler(Cart.removeFromCart)
);

router.get(
  "/getCart",
  authMiddleware(endPointsRoles.GET_CART),
  expressAsyncHandler(Cart.getCart)
);

export default router;

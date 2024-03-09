import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as orderController from "./order.controller.js";
import * as orderSchema from "./order.schema.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { endPointsRoles } from "./order.endpoints.js";

const router = Router();

router.post(
  "/",
  authMiddleware(endPointsRoles.CREATE_ORDER),
  validationMiddleware(orderSchema.createOrderSchema),
  expressAsyncHandler(orderController.createOrder)
);

router.post(
  "/convertCartToOrder",
  authMiddleware(endPointsRoles.CREATE_ORDER),
  validationMiddleware(orderSchema.convertCartToOrderSchema),
  expressAsyncHandler(orderController.convertCartToOrder)
);

router.get(
  "/",
  authMiddleware(endPointsRoles.GET_ORDERS),
  validationMiddleware(orderSchema.getOrdersSchema),
  expressAsyncHandler(orderController.getOrders)
);

router.get(
  "/:orderId",
  authMiddleware(endPointsRoles.GET_ORDER),
  validationMiddleware(orderSchema.getOrderSchema),
  orderController.getOrder
);

router.put(
  "/deliver/:orderId",
  authMiddleware(endPointsRoles.DELIVER_ORDER),
  validationMiddleware(orderSchema.deliverOrderSchema),
  expressAsyncHandler(orderController.deleverOrder)
);

router.post(
  "/payStripe/:orderId",
  authMiddleware(endPointsRoles.PAY_ORDER),
  validationMiddleware(orderSchema.payStripeSchema),
  expressAsyncHandler(orderController.payStripe)
);

export default router;

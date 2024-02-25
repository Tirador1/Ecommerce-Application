import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as authController from "./auth.controller.js";
import * as authSchema from "./auth.schema.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";

const router = Router();

router.post(
  "/signup",
  validationMiddleware(authSchema.signUpSchema),
  expressAsyncHandler(authController.signUp)
);

router.get(
  "/verify-email/:emailToken",
  expressAsyncHandler(authController.verifyEmail)
);

router.post(
  "/login",
  validationMiddleware(authSchema.loginSchema),
  expressAsyncHandler(authController.login)
);

export default router;

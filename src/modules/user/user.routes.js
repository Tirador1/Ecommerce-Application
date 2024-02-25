import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

import * as userController from "./user.controller.js";
import * as userSchema from "./user.schema.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/update-profile",
  validationMiddleware(userSchema.updateUserProfileSchema),
  authMiddleware(),
  expressAsyncHandler(userController.updateUserProfile)
);

router.post(
  "/change-password",
  validationMiddleware(userSchema.updatePasswordSchema),
  authMiddleware(),
  expressAsyncHandler(userController.updatePassword)
);

router.post(
  "/change-email",
  validationMiddleware(userSchema.updateEmailSchema),
  authMiddleware(),
  expressAsyncHandler(userController.updateEmail)
);

router.delete(
  "/delete-account",
  validationMiddleware(userSchema.deleteUserSchema),
  authMiddleware(),
  expressAsyncHandler(userController.deleteUser)
);

export default router;

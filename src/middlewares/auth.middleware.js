import jwt from "jsonwebtoken";
import User from "../../DB/models/user.model.js";

export const authMiddleware = (accessRoles = null) => {
  return async (req, res, next) => {
    try {
      const { accesstoken } = req.headers;
      if (!accesstoken)
        return next(new Error("please login first", { cause: 400 }));

      const decodedToken = jwt.verify(accesstoken, process.env.JWT_SECRET);
      if (!decodedToken || !decodedToken.id)
        return next(new Error("invalid token payload", { cause: 400 }));

      const user = await User.findById(decodedToken.id, "username email role");
      if (!user) return next(new Error("user not found", { cause: 404 }));

      if (accessRoles && !accessRoles.includes(user.role))
        return next(new Error("Unauthorized access", { cause: 403 }));

      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({ error: "Please authenticate." });
    }
  };
};

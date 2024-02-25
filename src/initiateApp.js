import { connectToDB } from "../DB/connection.js";
import * as routers from "./modules/indexRoutes.js";
import { globalResponse } from "./middlewares/globalResponse.middleware..js";
import { rollbackSavedDocuments } from "./middlewares/rollback-saved-documnets.middleware.js";
import { rollbackUploadedFiles } from "./middlewares/rollback-uploaded-files.middleware.js";

export const initiateApp = (app, express) => {
  const port = process.env.PORT;

  app.use(express.json());
  connectToDB();

  app.use("/auth", routers.authRouter);
  app.use("/user", routers.userRouter);
  app.use("/category", routers.categoryRouter);
  app.use("/sub-category", routers.subCategoryRouter);
  app.use("/brand", routers.brandRouter);
  app.use("/product", routers.productRouter);

  app.use(globalResponse, rollbackUploadedFiles, rollbackSavedDocuments);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

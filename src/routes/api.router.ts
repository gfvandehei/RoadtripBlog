import {Router} from "express";
import AuthRouter from "../routes/auth.router";
import BlogsRouter from "../routes/blogs.router";
import ImageRouter from "../routes/images.router";
import {userAuthMiddleware} from "../model/user.model";


const apiRouter = Router();

apiRouter.use("/auth", AuthRouter);
apiRouter.use("/blogs", userAuthMiddleware, BlogsRouter);
apiRouter.use("/images", userAuthMiddleware, ImageRouter);

export default apiRouter;
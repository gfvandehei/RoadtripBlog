import {config} from "dotenv";
config()
import AuthRouter from "./routes/auth.router";
import BlogsRouter from "./routes/blogs.router";
import express from "express";
import * as bodyParser from "body-parser";
import {sequelize} from "./services/database";
import {userAuthMiddleware} from "./model/user.model";
import ImageRouter from "./routes/images.router";
import * as logging from "./services/logging/middleware";
import * as cors from "cors";
import { allColors } from "winston/lib/winston/config";
import APIRouter from "./routes/api.router";

const app = express();
const port = 5690;

app.use(cors.default());
app.use(bodyParser.json({type: "application/json"}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logging.requestLoggingMiddleware);


app.all("/api", APIRouter);
app.all("*", (req, res) => {
    res.sendFile("/home/gvandehei/projects/RoadtripBlog/ui/blog-ui/dist/blog-ui/index.html");
});

app.all("/", (req, res) => {
    res.send("Hello World");
})

sequelize.sync({}).then(() =>
    app.listen(port, () => {
        console.log(`Blog Server listening on port ${port}`);
    })
)


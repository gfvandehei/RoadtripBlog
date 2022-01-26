import {config} from "dotenv";
config()
import AuthRouter from "./routes/auth.router";
import BlogsRouter from "./routes/blogs.router";
import express from "express";
import * as bodyParser from "body-parser";
import {sequelize} from "./services/database";
import {userAuthMiddleware} from "./model/user.model";

const app = express();
const port = 3000;

app.use(bodyParser.json({type: "application/json"}));
app.use("/auth", AuthRouter);
app.use("/blogs", userAuthMiddleware, BlogsRouter);

app.all("/", (req, res) => {
    res.send("Hello World");
})

sequelize.sync({
    force: false
}).then(() =>
    app.listen(port, () => {
        console.log(`Blog Server listening on port ${port}`);
    })
)


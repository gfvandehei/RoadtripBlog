import {Response, Router} from "express";
import { AuthRequest } from "../services/auth/auth.functions";
import {checkBlogReadPermissions, checkBlogWritePermissions, checkAdminPermissions} from "../services/auth/permissions";
import {BlogPost} from "../model/blogpost.model";
import { Blog } from "../model/blog.model";
import { UserPermission } from "../model/userpermissions.model";
import { Op } from "sequelize";
import {ImageFolder} from "../model/imagefolder.model";
import {baseImageDirectory, createStorageFolder} from "../services/images/imageStorage";

const blogRouter = Router();

blogRouter.get("/", async (req: AuthRequest, res) => {
    console.log("HERE");
    if(await checkAdminPermissions(req.tokenBody.email)){
        // list all blogs
        const blogs = await Blog.findAndCountAll();
        return res.send(blogs);
    } else{
        // get the blogs we have read permissions for
        const blogPermissions = await UserPermission.findAll({
            where: {
                user: req.tokenBody.email,
                table: "blogs",
                permission: {
                    [Op.in]: ['read', "*"]
                }
            }
        });
        const blogIDS = blogPermissions.map((value, i, arr) => value.object);
        const blogs = await Blog.findAndCountAll({
            where: {
                id: {
                    [Op.in]: blogIDS
                }
            }
        });
        return res.send(blogs);
    }
});

blogRouter.post("/", async (req: AuthRequest, res) => {
    if(await checkAdminPermissions(req.tokenBody.email)){
        const creationDate = new Date().toISOString()
        req.body.createdAt = creationDate;
        req.body.author = req.tokenBody.email;
        const newBlog = await Blog.create(req.body);
        // create an image folder for the blog
        const newFolder = await ImageFolder.create({
            name: newBlog.title+"_imagefolder",
            owner: req.tokenBody.email,
            path: await createStorageFolder(newBlog.title+"_imagefolder"),
            blog: newBlog.id
        });
        return res.send({
            blog: newBlog,
            imageFolder: newFolder
        })
    } else{
        return res.status(401).send("User does not have permissions to create blogs");
    }
});

blogRouter.get("/:blogId/posts", async (req: AuthRequest, res) => {
    const user = req.tokenBody.email;
    const blog = Number.parseInt(req.params.blogId, 10);
    const permission = await checkBlogReadPermissions(user, blog);
    if(!permission){
        return res.status(401).send("User does not have permission to view blog");
    }
    const blogPosts = await BlogPost.findAll({
        where: {
            blog
        }
    });
    return res.send({
        blogPosts
    });
});

blogRouter.post("/:blogId", async (req: AuthRequest, res: Response) => {
    const user = req.tokenBody.email;
    const blog = Number.parseInt(req.params.blogId, 10);
    // check we have permission to do this
    const permission = await checkBlogWritePermissions(user, blog);
    if(!permission){
        return res.status(401).send("User does not have permission to access blog");
    }
    // Attempt to create a blog post
    const newBlogPost = await BlogPost.create(req.body);

    return res.send({
        blogPost: newBlogPost
    });

});


export default blogRouter;
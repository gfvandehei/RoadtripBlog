import {Router} from "express";
import * as ImageStorageFunctions from "../services/images/imageStorage";
import * as multer from "multer"
import {Image} from "../model/image.model";
import {AuthRequest} from "../services/auth/auth.functions";
import * as PermissionFunctions from "../services/auth/permissions";
import { ImageFolder } from "../model/imagefolder.model";
import * as fs from "fs";
import * as stream from "stream";

const imageRouter = Router();

imageRouter.post("/", async (req: AuthRequest, res) => {
    if(!(await PermissionFunctions.checkAdminPermissions(req.tokenBody.email))){
        return res.status(401).send("You are not authorized to post photographs")
    }
    if(!req.query.folder){
        return res.status(404).send("Folder does not exist");
    }
    const folderId = Number.parseInt(req.query.folder as string, 10);
    const storage = await ImageStorageFunctions.getStorageByFolder(folderId);
    // console.log(req.body)
    const upload = multer.default({storage}).single("image");
    upload(req, res, async (err) => {
        if(err){
            console.log(err);
            return res.end("Error uploading this file");
        }
        try{
            const newImage = await Image.create({
                filePath: req.file.destination,
                fileType: req.file.mimetype,
                folderId,
                metadata: JSON.stringify(req.file),
                name: req.file.filename,
                uploadDate: new Date(),
                uploader: req.tokenBody.email
            });
            return res.send({
                image: newImage
            })
        } catch(err){
            console.log(err);
            return res.status(500).send(err);
        }
    });
});

imageRouter.get("/", async (req: AuthRequest, res) => {
    const imageId = Number.parseInt(req.query.image as string, 10);
    const image = await Image.findOne({
        where: {
            id: imageId
        }
    });
    const folder = await ImageFolder.findOne({
        where: {
            id: image.folderId
        }
    });

    if(!(await PermissionFunctions.checkBlogReadPermissions(req.tokenBody.email, folder.blog))){
        return res.status(401).send("You do not have permissions to view this photo")
    }
    const r = fs.createReadStream(image.filePath+"/"+image.name);
    const ps = new stream.PassThrough();
    stream.pipeline(
        r,
        ps,
        (err) => {
            if(err){
                console.log(err);
                return res.status(400).send(err);
            }
        }
    );
    ps.pipe(res);
});

export default imageRouter;
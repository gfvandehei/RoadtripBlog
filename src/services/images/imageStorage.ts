import * as multer from "multer";
import {} from "../../model/user.model";
import {ImageFolder} from "../../model/imagefolder.model";
import * as fs from "fs/promises";

/**
 * Image storage description
 * <base directory>/<uploading-username>/folder from request if exists/filename-date.now()
 */
export const baseImageDirectory = process.env.BASE_IMAGE_DIRECTORY || ".";

export async function getStorageByFolder(folderId: number){
    const imageFolder = await ImageFolder.findOne({
        where: {
            id: folderId
        }
    });
    if(!imageFolder){
        throw(Error("Image Folder does not exist"));
    }
    const storage = multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, imageFolder.path);
        },
        filename: (req, file, callback) => {
            callback(null, file.originalname);
        }
    });
    return storage;
}

export async function createStorageFolder(folderName: string){
    await fs.mkdir(baseImageDirectory+"/"+folderName);
    return baseImageDirectory + "/" + folderName;
}
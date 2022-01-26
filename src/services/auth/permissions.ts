import { Op } from "sequelize";
import {UserPermission} from "../../model/userpermissions.model";

export async function checkBlogReadPermissions(userEmail: string, blogId: number){
    const userPermissionsForBlog = UserPermission.findOne({
        where: {
            user: userEmail,
            table: "blog",
            object: blogId.toString(),
            permission: {
                [Op.in]: ["read", "*"]
            }
        }
    });
    return userPermissionsForBlog;
}

export async function checkBlogWritePermissions(userEmail: string, blogId: number){
    const userPermissionsForBlog = UserPermission.findOne({
        where: {
            user: userEmail,
            table: "blog",
            object: blogId.toString(),
            permission: {
                [Op.in]: ["write", "*"]
            }
        }
    });
    return userPermissionsForBlog;
}

export async function checkAdminPermissions(userEmail: string){
    const userPermissionsForBlog = UserPermission.findOne({
        where: {
            user: userEmail,
            table: "*",
            permission: {
                [Op.in]: ["write", "*"]
            }
        }
    });
    return userPermissionsForBlog;
}
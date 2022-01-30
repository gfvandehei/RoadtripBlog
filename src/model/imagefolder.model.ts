import { sequelize } from "../services/database";
import * as jwt from "jsonwebtoken";
import * as  authFunctions from "../services/auth/auth.functions";
import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model,
    ModelDefined, Optional, Sequelize
} from "sequelize";
import {BlogPost} from "./blogpost.model";
import { Image } from "./image.model";

interface ImageFolderAttributes{
    id: number;
    name: string;
    owner: string;
    path: string;
    blog: number
}

interface ImageFolderCreationAttributes extends Optional<ImageFolderAttributes, "id"> {}

export class ImageFolder extends Model<ImageFolderAttributes, ImageFolderCreationAttributes> implements ImageFolderAttributes{
    declare id: number;
    declare name: string;
    declare owner: string;
    declare blog: number;
    declare path: string;

    declare readonly images?: Image[];

    declare static associations: {
        images: Association<ImageFolder, Image>,
    }
}

ImageFolder.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        owner: {
            type: DataTypes.STRING,
            allowNull: false
        },
        blog: {
            type: DataTypes.INTEGER.UNSIGNED
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "imageFolders"
    }
)

ImageFolder.hasMany(Image, {
    sourceKey: "id",
    foreignKey: "folderId",
    as: "images"
});

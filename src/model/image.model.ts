import { sequelize } from "../services/database";
import * as jwt from "jsonwebtoken";
import * as  authFunctions from "../services/auth/auth.functions";
import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model,
    ModelDefined, Optional, Sequelize
} from "sequelize";
import {BlogPost} from "./blogpost.model";

interface ImageAttributes{
    id: number;
    name: string;
    folderId: number;
    fileType: string;
    filePath: string;
    uploader: string;
    uploadDate: Date;
    metadata: string;
}

interface ImageCreationAttributes extends Optional<ImageAttributes, "id"> {}

export class Image extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes{
    declare id: number;
    declare name: string;
    declare folderId: number;
    declare fileType: string;
    declare filePath: string;
    declare uploader: string;
    declare uploadDate: Date;
    declare metadata: string;
}

Image.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        folderId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fileType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        filePath: {
            type: DataTypes.STRING,
            allowNull: false
        },
        uploader: {
            type: DataTypes.STRING,
            allowNull: false
        },
        uploadDate: {
            type: DataTypes.DATE,
        },
        metadata: {
            type: DataTypes.TEXT,
        }
    },
    {
        sequelize,
        tableName: "images"
    }
);
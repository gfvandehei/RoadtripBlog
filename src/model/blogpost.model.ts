import { sequelize } from "../services/database";
import * as jwt from "jsonwebtoken";
import * as  authFunctions from "../services/auth/auth.functions";
import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model,
    ModelDefined, Optional, Sequelize
} from "sequelize";

interface BlogPostAttributes{
    id: number,
    blog: number,
    title: string,
    author: string,
    creationDate: Date,
    updatedDate: Date,
    content: string
}

interface BlogPostCreationAttributes extends Optional<BlogPostAttributes, "id"> {}

export class BlogPost extends Model<BlogPostAttributes, BlogPostCreationAttributes> implements BlogPostAttributes{
    declare id: number;
    declare blog: number;
    declare title: string;
    declare author: string;
    declare creationDate: Date;
    declare updatedDate: Date;
    declare content: string;
}

BlogPost.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        blog: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creationDate: {
            type: DataTypes.DATE,
        },
        updatedDate: {
            type: DataTypes.DATE,
        },
        content: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        tableName: "blogPosts"
    }
)

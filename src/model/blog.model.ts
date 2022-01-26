import { sequelize } from "../services/database";
import * as jwt from "jsonwebtoken";
import * as  authFunctions from "../services/auth/auth.functions";
import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model,
    ModelDefined, Optional, Sequelize
} from "sequelize";
import {BlogPost} from "./blogpost.model";

interface BlogAttributes{
    id: number;
    title: string;
    author: string;
    creationDate: Date;
}

interface BlogCreationAttributes extends Optional<BlogAttributes, "id"> {}

export class Blog extends Model<BlogAttributes, BlogCreationAttributes> implements BlogAttributes{
    declare id: number;
    declare title: string;
    declare author: string;
    declare creationDate: Date;

    declare getBlogPosts: HasManyGetAssociationsMixin<BlogPost>;
    declare addBlogPost: HasManyAddAssociationMixin<BlogPost, number>;
    declare hasBlogPost: HasManyHasAssociationMixin<BlogPost, number>;
    declare countBlogPosts: HasManyCountAssociationsMixin;
    declare createBlogPost: HasManyCreateAssociationMixin<BlogPost>;

    declare readonly blogPosts?: BlogPost[];

    declare static associations: {
        blogPosts: Association<Blog, BlogPost>,
    }
}

Blog.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
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
        }
    },
    {
        sequelize,
        tableName: "blog"
    }
)

Blog.hasMany(BlogPost, {
    sourceKey: "id",
    foreignKey: "blog",
    as: "blogPosts"
});

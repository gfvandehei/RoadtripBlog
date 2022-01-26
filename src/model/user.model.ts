import { sequelize } from "../services/database";
import * as jwt from "jsonwebtoken";
import * as  authFunctions from "../services/auth/auth.functions";
import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model,
    ModelDefined, Optional, Sequelize
} from "sequelize";
import {BlogPost} from "./blogpost.model";
import { UserPermission } from "./userpermissions.model";

interface UserAttributes{
    lastName: string,
    firstName: string,
    email: string,
    password: string,
    salt: string
}

export class User extends Model<UserAttributes> implements UserAttributes{
    declare lastName: string;
    declare firstName: string;
    declare email: string;
    declare password: string;
    declare salt: string;

    declare getBlogPosts: HasManyGetAssociationsMixin<BlogPost>;
    declare addBlogPost: HasManyAddAssociationMixin<BlogPost, number>;
    declare hasBlogPost: HasManyHasAssociationMixin<BlogPost, number>;
    declare countBlogPosts: HasManyCountAssociationsMixin;
    declare createBlogPost: HasManyCreateAssociationMixin<BlogPost>;

    declare getUserPermissions: HasManyGetAssociationsMixin<UserPermission>;
    declare addUserPermission: HasManyAddAssociationMixin<UserPermission, number>;
    declare hasUserPermission: HasManyHasAssociationMixin<UserPermission, number>;
    declare countUserPermissions: HasManyCountAssociationsMixin;
    declare createUserPermission: HasManyCreateAssociationMixin<UserPermission>;

    declare readonly blogPosts?: BlogPost[];
    declare readonly userPermissions?: UserPermission[];


    declare static associations: {
        blogPosts: Association<User, BlogPost>,
        userPermissions: Association<User, UserPermission>
    }
}

User.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "users",
    sequelize
});

User.hasMany(BlogPost, {
    sourceKey: "email",
    foreignKey: "author",
    as: "blogPosts"
});

User.hasMany(UserPermission, {
    sourceKey: "email",
    foreignKey: "user",
    as: "userPermissions"
});

export async function createUser(firstName: string, lastName: string, email: string, password: string): Promise<User>{
    // check if a user with email already exists
    const usersWithEmail = await User.findAndCountAll({
        where: {
            email
        }
    });
    // throw error if a user with email already exists
    if(usersWithEmail.count > 0){
        throw(Error("User already exists with information requested"))
    }
    // create password hash
    const newSalt = authFunctions.generateSalt();
    const passwordHash = authFunctions.generatePasswordHash(password, newSalt);
    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: passwordHash,
        salt: newSalt,
    });
    return newUser;
}

export function stripUser(user: User){
    return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }
}

export async function userAuthMiddleware(req: any, res: any, next: CallableFunction){
    const xtoken = req.headers['x-access-token'];
    if(!xtoken){
        return res.status(401).send("No access token found");
    }
    try{
        const tokenBody = authFunctions.validateWebToken(xtoken) as jwt.JwtPayload;
        // get user based on user
        req.tokenBody = tokenBody;
        if(tokenBody.exp - Date.now() < 60){
            // generate new token for user
            const newToken = authFunctions.generateWebToken(tokenBody.email);
            res.set('refresh-token', newToken);
        }
        return next();
    } catch(err){
        if(err instanceof jwt.TokenExpiredError){
            return res.status(401).send("Token Expired");
        }
        else{
            console.log(err);
            return res.status(500).send(err);
        }
    }
}
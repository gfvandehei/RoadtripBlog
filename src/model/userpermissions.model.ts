import { sequelize } from "../services/database";
import * as jwt from "jsonwebtoken";
import * as  authFunctions from "../services/auth/auth.functions";
import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, Model,
    ModelDefined, Optional, Sequelize
} from "sequelize";

interface UserPermissionAttributes{
    id: number
    user: string,
    permission: string,
    table: string,
    object: string
}

interface UserPermissionCreationAttributes extends Optional<UserPermissionAttributes, "id"> {}

export class UserPermission extends Model<UserPermissionAttributes, UserPermissionCreationAttributes> implements UserPermissionAttributes{
    declare id: number
    declare user: string
    declare permission: string
    declare table: string
    declare object: string
}

UserPermission.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false
        },
        permission: {
            type: DataTypes.STRING,
            allowNull: false
        },
        table: {
            type: DataTypes.STRING,
        },
        object: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        tableName: "userPermissions"
    }
)
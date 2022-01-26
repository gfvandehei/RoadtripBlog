// const {Sequelize} = require("sequelize");
import { Sequelize } from "sequelize";

// console.log(process.env.DATABASE_URI);
export const sequelize = new Sequelize(process.env.DATABASE_URI, {
    dialect: 'mysql'
});

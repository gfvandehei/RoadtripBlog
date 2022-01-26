import * as crypto from "crypto";
import { Request } from "express";
import * as jwt from "jsonwebtoken";

export function generateSalt(){
    return crypto.randomBytes(16).toString('hex');
}

export function generatePasswordHash(password: string, salt: string){
    return crypto.pbkdf2Sync(password, salt,  1000, 64, `sha512`).toString(`hex`);
}

export function generateWebToken(email: string){
    const token = jwt.sign({
            email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "2h"
        }
    );
    return token;
}


export function validateWebToken(token: string){
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    return decodedToken;
}

export type AuthRequest = Request & {
    tokenBody: {email: string} & jwt.JwtPayload
};
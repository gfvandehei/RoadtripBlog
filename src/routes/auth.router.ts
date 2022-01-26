import express from "express";
import * as UserModel from "../model/user.model";
import * as AuthFunctions from "../services/auth/auth.functions";

const router = express.Router()

router.post("/register", async (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    // validate input
    if(!(email && password && firstName && lastName)){
        return res.status(400).send("Missing required input");
    }
    // try to create the user
    try{
        const createdUser = await UserModel.createUser(
            firstName,
            lastName,
            email,
            password
        )
        // create token for user
        const token = AuthFunctions.generateWebToken(email);
        return res.status(200).send({
            user: UserModel.stripUser(createdUser),
            token
        });
    } catch(err){
        console.log(err);
        return res.status(500).send(err);
    }
})

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!(email && password)){
        return res.status(400).send("Missing email or password");
    }
    const requestedUser = await UserModel.User.findOne({
        where: {
            email
        }
    });
    if(!requestedUser){
        return res.status(404).send("User does not exist");
    }
    const passhash = AuthFunctions.generatePasswordHash(password, requestedUser.salt);
    if(passhash !== requestedUser.password){
        // the password does not match do not log in
        return res.status(401).send("Password Incorrect");
    } else{
        return res.send({
            token: AuthFunctions.generateWebToken(email)
        })
    }
});

router.get("/info", async (req, res) => {
    const token = req.headers['x-access-token'] as string;
    if(!token){
        return res.status(401).send("User is not logged in");
    } else{
        const body = AuthFunctions.validateWebToken(token);
        console.log(body);
        return res.send(body);
    }
})


export default router;
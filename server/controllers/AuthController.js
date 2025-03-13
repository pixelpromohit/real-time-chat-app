import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;


const maxAge = 3 * 24 * 60 * 60 * 1000

const createToken = (email, userId) => {
    return jwt.sign({email, userId}, process.env.JWT_KEY, {expiresIn: maxAge})
}

export const signup = async (request, response, next) => {
    try{
        const {email, password} = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password is required.")
        }
        const user = await User.create({email, password});
        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure:true,
            sameSite: "None",
        });
        return response.status(201).json({user:{
            id:user.id,
            email:user.email,
            profileSetup:user.profileSetup,
            
        }})

    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error")
    }
}

export const login = async (request, response, next) => {
    try{
        const {email, password} = request.body;
        if (!email || !password) {
            return response.status(400).send("Email and Password is required.")
        }
        const user = await User.findOne({email});
        if (!user) {
            return response.status(404).send("User with the given email not found.")
        }
        
        const auth = await compare(password, user.password);

        if (!auth) {
            return response.status(400).send("Password is incorrect");
        }

        response.cookie("jwt", createToken(email, user.id), {
            maxAge,
            secure: true,
            sameSite: "None",
        })

        return response.status(200).json({user:{
            id:user.id,
            email:user.email,
            profileSetup:user.profileSetup,
            firstName:user.firstName,
            lastName:user.lastName,
            image:user.image,
            color:user.color,
        }})

    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error")
    }
}

export const getUserInfo = async (request, response, next) => {
    try{
        const userData = await User.findById(request.userId)
        if (!userData) {
            return response.status(404).send("User with the given id not found.")
        }

        return response.status(200).json({
            id:userData.id,
            email:userData.email,
            profileSetup:userData.profileSetup,
            firstName:userData.firstName,
            lastName:userData.lastName,
            image:userData.image,
            color:userData.color,
        })

    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error")
    }
}

export const updateProfile = async (request, response, next) => {
    try{
        const {userId} = request
        const {firstName, lastName, color} = request.body
        if (!firstName || !lastName) {
            return response.status(400).send("FirstName, LastName, and color is required.")
        }

        const userData = await User.findByIdAndUpdate(userId, {
                firstName, 
                lastName, 
                color, 
                profileSetup:true
            }, 
            {new:true, runValidators:true}
        )

        return response.status(200).json({
            id:userData.id,
            email:userData.email,
            profileSetup:userData.profileSetup,
            firstName:userData.firstName,
            lastName:userData.lastName,
            image:userData.image,
            color:userData.color,
        })

    } catch (error) {
        console.log({error});
        return response.status(500).send("Internal Server Error")
    }
}
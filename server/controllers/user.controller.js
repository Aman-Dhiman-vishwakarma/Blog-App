import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypejs from "bcryptjs";


export const test = (req, res)=>{
    res.json({message:"hello word"})
}

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allow to update this user")) 
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(403, "Password must be atlest 6 characters")) 
        }
        req.body.password = bcrypejs.hashSync(req.body.password, 10)
    }
    if(req.body.username){
        
    if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(errorHandler(403, "Username must be between 7 and 20 characters")) 
    }
    if (req.body.username.includes(' ')) {
        return next(errorHandler(403, "Username can not contain spaces")) 
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(403, "Username must be lowercase")) 
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(errorHandler(403, "Username can only contain latters and number")) 
    }
}
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId, {$set:{
            username:req.body.username,
            email:req.body.email,
            profilePicture:req.body.profilePicture,
            password:req.body.password
        }}, {new:true})
        const {password, ...rest} = updateUser._doc
        res.status(200).json({success:true, message: "Profile updated successfully", updateUser:rest} )
    } catch (error) {
       next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allow to delete this user")) 
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json("User has been deleted")
    } catch (error) {
        next(error)
    }
}

export const signOut = async (req, res, next) => {
    try {
        res.clearCookie("access_token").status(200).json("User has been signed out")
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allow to see all users")) 
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const shortDirection = req.query.order === "asc" ? 1 : -1

        const users = await User.find().sort({createdAt:shortDirection}).skip(startIndex).limit(limit)

        const userWithoutPassword = users.map((user)=> {
            const {password, ...rest} = user._doc
            return rest;
        })

        const totalUser = await User.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthUser = await User.countDocuments({createdAt:{$gte:oneMonthAgo}})
        res.status(200).json({users:userWithoutPassword, totalUser, lastMonthUser})
    } catch (error) {
        next(error)
    }
}

export const getSingleUser = async (req, res, next) => {
   try {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(errorHandler(404, "user not found")) 
    }
    const {password, ...rest} = user._doc
    res.status(200).json(rest)
   } catch (error) {
    next(error)
   }
}
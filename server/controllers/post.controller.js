import { Post } from "../models/post.model.js"
import { errorHandler } from "../utils/error.js"

export const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You are not allowed to create post"))
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, "Please provide all required fields"))
    }

    const slug = req.body.title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')

    const newPost = Post({
        ...req.body,
        slug,
        userId:req.user.id
    })
    try {
        const savePost =  await newPost.save();
        res.status(200).json({success:true, post:savePost, messege:"Post Created Successfully"})
    } catch (error) {
        next(error)
    }
   
}

export const getPosts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const shortDirection = req.query.order === "asc" ? 1 : -1

        const posts = await Post.find({
            ...(req.query.userId && {userId:req.query.userId}),
            ...(req.query.category && {category:req.query.category}),
            ...(req.query.slug && {slug:req.query.slug}),
            ...(req.query.postId && {_id:req.query.postId}),
            ...(req.query.searchTerm && {
                $or:[
                    {title:{$regex:req.query.searchTerm, $options:"i"}},
                    {content:{$regex:req.query.searchTerm, $options:"i"}}
                ]
            }),
        }).sort({updatedAt:shortDirection}).skip(startIndex).limit(limit)

        const totalPosts = await Post.countDocuments();
        const now = new Date()
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth()-1, now.getDate())
        const lastMonthsPost = await Post.countDocuments({createdAt:{$gte:oneMonthAgo}})

        res.status(200).json({posts, totalPosts, lastMonthsPost})
    } catch (error) {
        next(error)
    }
} 

export const deletePost = async (req, res, next) => {
   if (!req.user.isAdmin || (req.user.id !== req.params.userId)) {
    return next(errorHandler(403, "You are not allowed to delete this post"))
   }
   try {
    await Post.findByIdAndDelete(req.params.postId)
    res.status(200).json("The post has been deleted")
   } catch (error) {
    next(error)
   }
}

export const updatepost = async (req, res, next) => {
    if (!req.user.isAdmin || (req.user.id !== req.params.userId)) {
        return next(errorHandler(403, "You are not allowed to delete this post"))
       }
       try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {
            $set:{
                title:req.body.title,
                category:req.body.category,
                image:req.body.image,
                content:req.body.content,
            }
        }, {new:true})
        res.status(200).json(updatedPost)
       } catch (error) {
        next(error)
       }
}
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createComment, deleteComment, editComment, getComment, getPostComments, likeComment } from "../controllers/comment.controller.js";
const router = express.Router()

router.post("/create", verifyToken, createComment)
router.get("/getPostComments/:postId", getPostComments)
router.put("/likecomment/:commentId", verifyToken, likeComment)
router.put("/editcomment/:commentId", verifyToken, editComment)
router.delete("/deletcomment/:commentId", verifyToken, deleteComment)
router.get("/getcomments", verifyToken, getComment)



export default router;
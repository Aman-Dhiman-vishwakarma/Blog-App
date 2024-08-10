import express from "express";
import { deleteUser, getSingleUser, getUsers, signOut, test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router()

router.get("/test",test)
router.put("/updateuser/:userId", verifyToken, updateUser)
router.delete("/deleteuser/:userId", verifyToken, deleteUser)
router.post("/signout", signOut)
router.get("/getusers", verifyToken, getUsers)
router.get("/getsingleuser/:userId", getSingleUser)


export default router;
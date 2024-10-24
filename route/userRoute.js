import express from "express"
import { loginUser, registerUser, updateUser, deleteUser, getProjectsByUser, getMissionByUser, getTaskByUser, getAllUser } from "../controller/userController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login", loginUser)
userRouter.put('/:id', authMiddleware, updateUser);
userRouter.delete('/:id', authMiddleware, deleteUser);
userRouter.get("/projects", authMiddleware, getProjectsByUser);
userRouter.get("/missions/", authMiddleware, getMissionByUser)
userRouter.get("/tasks/", authMiddleware, getTaskByUser)
userRouter.get("/all-users", authMiddleware, getAllUser);
export {userRouter}
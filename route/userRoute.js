import express from "express"
import { loginUser, registerUser,getUsers, getUserProjects, getUserProjectTasks } from "../controller/userController.js"
import authMiddleware from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login", loginUser)
userRouter.get('/users', authMiddleware, getUsers);
userRouter.get('/:userId/projects', authMiddleware, getUserProjects);
userRouter.get('/users/:userId/projects/:projectId/tasks', authMiddleware, getUserProjectTasks);
export {userRouter}
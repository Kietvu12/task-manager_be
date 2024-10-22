import express from "express"
import { loginUser, registerUser, updateUser, deleteUser, getProjectByUser, getMissionByUser, getTaskByUser } from "../controller/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login", loginUser)
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);
userRouter.get("/projects/:id", getProjectByUser)
userRouter.get("/missions/:id", getMissionByUser)
userRouter.get("/tasks/:id",getTaskByUser)
export {userRouter}
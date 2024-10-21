import express from "express"
import { loginUser, registerUser, updateUser, deleteUser } from "../controller/userController.js"

const userRouter = express.Router()

userRouter.post("/register",registerUser)
userRouter.post("/login", loginUser)
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

export {userRouter}
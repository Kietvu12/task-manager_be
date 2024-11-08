import express from 'express'
import cors from "cors"
import { connectDB } from './config/db.js'
import { userRouter } from './route/userRoute.js'
import'dotenv/config'
import {  projectRouter } from './route/projectRoute.js'
import { taskRouter } from './route/taskRoute.js'


const app = express()
const port = 4001

app.use(express.json())
app.use(cors())

connectDB()

app.use("/api/user", userRouter)
app.use("/api/project", projectRouter)
app.use("/api/task", taskRouter)


app.get("/", (req, res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`);
    
})
import userModel from "../model/userModels.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import Project from "../model/projectModels.js"
import Task from "../model/taskModels.js"




const loginUser = async (req,res) => {
    const {email, password} = req.body
    try {
        const user =  await userModel.findOne({email})
        if(!user){
            return res.json({success: false, message: "User doesn't exists"})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({success: false, message: "Invalid credentials"})
        }
        const token = createToken(user._id)
        res.json({ success: true, token, userId: user._id });
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET)
}
const registerUser = async(req, res) =>{
    const {name, password, email} = req.body
    try {
        const exists = await userModel.findOne({email})
        if(exists){
            return res.json({success: false, message: "User already exists"})
        }
        if(!validator.isEmail(email)){
            return res.json({success: false, message: "Please enter a valid email!"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new userModel({
            name: name,
            email: email, 
            password: hashedPassword
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success: true, token})
    } catch (error) {
        console.log(error)
    res.json({success: false, message: "Error"})
        
    }
}
export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
};

export const getUserProjects = async (req, res) => {
    const { userId } = req.params;
    try {
        
        const projects = await Project.find({ participants: userId })
            .populate('participants', 'name avatar') 
            .exec();

        res.json({ success: true, projects });
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ success: false, message: "Error fetching user's projects" });
    }
};

export const getUserProjectTasks = async (req, res) => {
    const { userId, projectId } = req.params;
    try {
        const tasks = await Task.find({ project: projectId, participants: userId })
        .populate('participants', 'name avatar') 
            .exec();
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching user's project tasks" });
    }
};
export {loginUser, registerUser}
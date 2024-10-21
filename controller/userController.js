import userModel from "../model/userModels.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import projectModel from "../model/projectModels.js"
import taskModel from "../model/taskModels.js"
import missionModel from "../model/missionModels.js"

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
        res.json({success:true, token})
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
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(id, { name, email, password }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        await projectModel.updateMany(
            { "participants.userId": id },
            { $set: { "participants.$[elem].username": name } },
            { arrayFilters: [{ "elem.userId": id }] }
        );
        
        await missionModel.updateMany(
            { "creator.userId": id },
            { $set: { "creator.username": name } }
        );
        
        await taskModel.updateMany(
            { "creator.userId": id },
            { $set: { "creator.username": name } }
        );

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting user with id:", id);
        const deletedUser = await userModel.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        await projectModel.updateMany(
            {},
            { $pull: { participants: { userId: id } } }
        );
        await missionModel.updateMany(
            { "creator.userId": id },
            { $unset: { creator: "" } }
        );
        await taskModel.updateMany(
            { "creator.userId": id },
            { $unset: { creator: "" } }
        );
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export {loginUser, registerUser}
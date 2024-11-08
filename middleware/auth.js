import jwt from "jsonwebtoken";

const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 
    if(!token){
        return res.json({success: false, message:"Not authorized login again"})
    }
    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { id: token_decode.id };
        next()
    } catch (error) {
        console.log(error)
        res.json({success: false, message: "Error"})
    }
}
export default authMiddleware

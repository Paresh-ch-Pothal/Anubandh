const JWT=require("jsonwebtoken");
const JWT_SECRET="^@12@34#%^&8@1%6$5^&#1234";

const fetchuser=(req,res,next)=>{
    const token=req.header("auth-token");
    if(!token){
        return res.status(401).send("The Token is not found");
    }
    try {
        const data=JWT.verify(token,JWT_SECRET);
        console.log(data.user._id);
        req.user=data.user;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).send("Some internal error might be happened");
    }
}

module.exports=fetchuser;
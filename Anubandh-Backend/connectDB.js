const mongoose=require("mongoose")
const ConnecttomongoDB=async()=>{
    try {
        const connection = await mongoose.connect("mongodb://localhost:27017/anubandhMain")
        console.log("Mongodb is connected successfully");
    } catch (error) {
        console.log(error,"Not connected Successfully");
        
    }
}

module.exports=ConnecttomongoDB
const mongoose = require("mongoose");
const User = require("./user");

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
    "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", 
    "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry"
];

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        enum: indianStates
    },
    pincode: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    adminPassword: {
        type: String,
        required: true 
    },
    studentAutheticate:[
        {
            email:{
                type: String,
                required: true
            }
        }
    ],
    studentDatabase: [
        {
            student:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
},{
    timestamps: true
});

const College = mongoose.model("College", collegeSchema);

module.exports = College;
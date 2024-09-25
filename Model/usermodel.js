const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userschema = new Schema({
   googleId: {  
        type: String,  
        required: true,  
    },  
    displayName: {  
        type: String,  
    },  
    email: {  
        type: String,  
    },  
    picture: {  
        type: String,  
    }, 
  role: { type: String, required: true, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });  // Enable timestamps

module.exports = mongoose.model("User", userschema);

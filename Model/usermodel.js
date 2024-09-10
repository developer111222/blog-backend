const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userschema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["user", "admin"], default: "user" }
}, { timestamps: true });  // Enable timestamps

module.exports = mongoose.model("User", userschema);

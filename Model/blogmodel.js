const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogschema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogschema);

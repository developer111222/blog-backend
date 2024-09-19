const mongoose = require('mongoose');
const { Schema } = mongoose;

const friendRequestSchema = new Schema({
  requester: { type: Schema.Types.ObjectId, ref: 'User' }, // User who sends the request
  recipient: { type: Schema.Types.ObjectId, ref: 'User' }, // User who receives the request
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }, // Status of request
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FriendRequest', friendRequestSchema);

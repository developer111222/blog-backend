const User=require('../Model/usermodel')
const FriendRequest=require("../Model/socketmodel")


// REST API for sending and handling friend requests

    exports.sendfriendrequest=async (req, res) => {
    const { userId, recipientId } = req.body;
  console.log(req.body,"vb")

  if (!userId || !recipientId) {
    return res.status(400).json({ message: 'User ID and Recipient ID are required.' });
}

try {
  // Check if a friend request already exists
  const existingRequest = await FriendRequest.findOne({ requester: userId, recipient: recipientId });
  if (existingRequest) {
      console.log("Existing Friend Request Found:", existingRequest);
      return res.status(400).json({ message: 'Friend request already sent!' });
  }

  // Create new friend request
  const friendRequest = new FriendRequest({
      requester: userId,
      recipient: recipientId,
  });

  console.log("New Friend Request Created:", friendRequest);

  // Save the friend request to the database
  await friendRequest.save();

  // Check if `io` is defined and emit a WebSocket event to notify the recipient
  if (typeof io !== 'undefined') {
      io.to(recipientId).emit('friendRequest', {
          userId,
          status: 'pending',
      });
      console.log(`Friend request notification sent to ${recipientId} via WebSocket.`);
  } else {
      console.error("WebSocket (io) is not defined.");
  }

  return res.status(200).json({ message: 'Friend request sent!' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  // Handle accept or decline of friend requests

  exports.userrespondrequest = async (req, res) => {
    const { requestId, response } = req.body;
  
    // Log the incoming request body for debugging
    console.log("Request Body:", req.body);
  
    // Validate input: requestId and response should exist
    if (!requestId || !response) {
      return res.status(400).json({ message: 'Request ID and response are required.' });
    }
  
    try {
      // Find the friend request by ID
      const friendRequest = await FriendRequest.findById(requestId);
      if (!friendRequest) {
        console.log("Friend request not found");
        return res.status(404).json({ message: 'Friend request not found!' });
      }
  
      console.log("Found Friend Request:", friendRequest);
  
      // Update the status based on the response
      if (response === 'accept') {
        friendRequest.status = 'accepted';
      } else if (response === 'decline') {
        friendRequest.status = 'declined';
      } else {
        return res.status(400).json({ message: 'Invalid response value. Must be "accept" or "decline".' });
      }
  
      // Save the updated friend request status
      await friendRequest.save();
  
      // Check if `io` is defined and emit a WebSocket event
      if (typeof io !== 'undefined') {
        io.to(friendRequest.requester.toString()).emit('friendRequestResponse', {
          recipientId: friendRequest.recipient,
          status: friendRequest.status,
        });
        console.log(`Response sent to ${friendRequest.requester.toString()} via WebSocket.`);
      } else {
        console.error("WebSocket (io) is not defined.");
      }
  
      return res.status(200).json({ message: `Friend request ${response}ed!` });
    } catch (error) {
      // Log the actual error for debugging
      console.error("Error in userrespondrequest:", error);
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };
  



  // REST API for fetching friend requests
exports.fetchFriendRequests = async (req, res) => {
  let { id } = req.params; // Retrieve userId from query parameters
  
  const userId=id
  try {
    // Fetch friend requests where the recipient is the userId
    const friendRequests = await FriendRequest.find({ recipient: userId });
    
    if (!friendRequests.length) {
      return res.status(404).json({ message: 'No friend requests found.' });
    }

    // Optionally, you can fetch additional information about the requester
    // Here’s how you might enrich the friend request data with requester info
    const enrichedRequests = await Promise.all(friendRequests.map(async (request) => {
      const requester = await User.findById(request.requester);
      return {
        ...request.toObject(),
        requesterName: requester ? requester.name : 'Unknown',
      };
    }));

    return res.status(200).json(enrichedRequests);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
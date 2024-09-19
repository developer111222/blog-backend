const express = require("express");
const router=express.Router();
const {authorizationUser,authorizationRoles}=require("../Utils/tokenverify")
const {sendfriendrequest,userrespondrequest,fetchFriendRequests} =require("../Controller/socketcontroller")

router.route('/friend-request/send').post(authorizationUser,sendfriendrequest)
router.route('/friend-request/respond').post(authorizationUser,userrespondrequest)
router.route('/friend-requests/:id').get(authorizationUser,fetchFriendRequests)


module.exports = router;
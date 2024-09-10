const express = require("express");
const router=express.Router();
const {usersignup,userlogin,getprofile,userlogout}=require("../Controller/usercontroller")
const {authorizationUser,authorizationRoles}=require("../Utils/tokenverify")

router.route('/signup').post(usersignup);
router.route('/login').post(userlogin);
router.route('/profile').get(authorizationUser,getprofile)
router.route('/logout').post(userlogout);



module.exports =router
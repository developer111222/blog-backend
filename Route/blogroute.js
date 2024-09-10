const express = require("express");
const router=express.Router();
const {createBlog,getBlogs,getSingleBlog}=require("../Controller/blogcontroller");
const {authorizationUser }=require("../Utils/tokenverify")

router.route('/create-blog').post(authorizationUser,createBlog);
router.route('/get-blog').get(getBlogs)
router.route('/get-single-blog/:id').get(getSingleBlog);


module.exports = router
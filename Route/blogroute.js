const express = require("express");
const router=express.Router();
const {createBlog,getBlogs,getSingleBlog}=require("../Controller/blogcontroller");
const {authorizationUser }=require("../Utils/tokenverify");
const upload=require("../Middleware/multer")

router.route('/create-blog').post(authorizationUser,upload.single('image'),createBlog);
router.route('/get-blog').get(getBlogs)
router.route('/get-single-blog/:id').get(getSingleBlog);


module.exports = router
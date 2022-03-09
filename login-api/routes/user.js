const express = require("express");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.get("/detail", isAuth, userController.getUserDetail);
router.post("/post", isAuth, userController.createPost); //CREATE POST
router.get("/post", isAuth, userController.getPosts); //GET POSTS
router.get("/post/:postId", isAuth, userController.getPost); //GET SINGLE POST
router.put("/post/:postId", isAuth, userController.updatePost); //UPDATE POST
router.delete("/post/:postId", isAuth, userController.deletePost); //DELETE POST

module.exports = router;

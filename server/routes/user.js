const express = require("express");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const { body } = require("express-validator");
const router = express.Router();

router.get("/detail", isAuth, userController.getUserDetail);
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 5 }),
  ],
  isAuth,
  userController.createPost
); //CREATE POST
router.get("/post", isAuth, userController.getPosts); //GET POSTS
router.get("/post/:postId", isAuth, userController.getPost); //GET SINGLE POST
router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("description").trim().isLength({ min: 5 }),
  ],
  isAuth,
  userController.updatePost
); //UPDATE POST
router.delete("/post/:postId", isAuth, userController.deletePost); //DELETE POST

router.put("/status", isAuth, userController.updateStatus);

module.exports = router;

const User = require("../models/user");
const Post = require("../models/post");
const { validationResult } = require("express-validator");
exports.getUserDetail = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      console.log(user);
      if (!user) {
        const error = new Error("No user Found!");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ detail: user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    const error = new Error("Validation failed entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const title = req.body.title;
  const description = req.body.description;
  if (!req.file) {
    const error = new Error("Image not provided");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  console.log(title, description);
  console.log(req.file);
  let creator;
  const post = new Post({
    title: title,
    description: description,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      console.log(res);
      res.status(201).json({ message: "Post Created ", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPosts = (req, res, next) => {
  let currentPage = req.query.page || 1;
  const PAGE_SIZE = 2;
  let totalPages;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalPages = Math.ceil(count / PAGE_SIZE);
      return Post.find()
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE);
    })
    .then((posts) => {
      res
        .status(200)
        .json({
          message: "Posts fetched sucessfully",
          pages: totalPages,
          data: posts,
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  console.log(postId);
  Post.findById(postId)
    .then((post) => {
      res.status(200).json({ message: "Post fetched succesfully", post: post });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    const error = new Error("Validation failed entered data is incorrect");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  let imageUrl = req.body.image;
  console.log(imageUrl);
  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }
  Post.findById(postId)
    .then((post) => {
      if (post.creator.toString() !== postId) {
        console.log("Not Authorized");
      }
      post.title = updatedTitle;
      post.imageUrl = imageUrl;
      post.description = updatedDescription;
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "updated successfully", data: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No Post found");
        error.statusCode = 404;
        throw error;
      }
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then(() => {
      console.log("Post deleted successfully");
      res.status(200).json({ message: "deleted" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

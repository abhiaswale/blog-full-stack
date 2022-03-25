const User = require("../models/user");
const Post = require("../models/post");
const fs = require("fs");
const cloudinary = require("../util/cloudinary");
const path = require("path");
const { validationResult } = require("express-validator");
const user = require("../models/user");
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
  let cImageUrl, c_id, post;
  cloudinary.uploader
    .upload(req.file.path)
    .then((result) => {
      console.log(result);
      cImageUrl = result.secure_url;
      c_id = result.public_id;
    })
    .then(() => {
      post = new Post({
        title: title,
        description: description,
        imageUrl: cImageUrl,
        cloudinary_id: c_id,
        creator: req.userId,
      });
      return post.save();
    })

    .then((result) => {
      console.log(req.userId);
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      console.log(res);
      res.status(201).json({
        message: "Blog posted successfully",
        post: post,
      });
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
  const PAGE_SIZE = 4;
  let totalPages;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalPages = Math.ceil(count / PAGE_SIZE);
      return Post.find()
        .populate("creator")
        .skip((currentPage - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .sort({ createdAt: -1 });
    })
    .then((posts) => {
      res.status(200).json({
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
      if (!post) {
        const error = new Error("Post does not exist!");
        error.statusCode = 402;
        throw err;
      }
      res.status(200).json({ message: "Post fetched succesfully", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = async (req, res, next) => {
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
  let postt;
  Post.findById(postId)
    .then((post) => {
      postt = post;
      if (!post) {
        const error = new Error("Post does not exist!");
        error.statusCode = 402;
        throw err;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized");
        error.statusCode = 401;
        throw error;
      }
      const prevImg = post.imageUrl;
      const prevCloudId = post.cloudinary_id;
      if (req.file) {
        cloudinary.uploader.destroy(post.cloudinary_id);
        return cloudinary.uploader.upload(req.file.path).then((respo) => {
          post.imageUrl = respo.secure_url;
          post.cloudinary_id = respo.public_id;
        });
      } else {
        post.imageUrl = prevImg;
        post.cloudinary_id = prevCloudId;
      }
    })
    .then((data) => {
      postt.title = updatedTitle;
      postt.description = updatedDescription;
      return postt.save();
    })
    .then((result) => {
      res
        .status(200)
        .json({ message: "Post updated successfully", data: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
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
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized");
        error.statusCode = 401;
        throw error;
      }
      // clearImage(post.imageUrl);
      cloudinary.uploader.destroy(post.cloudinary_id);
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
      res.status(200).json({ message: "Post Deleted!" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateStatus = (req, res, next) => {
  const newStatus = req.body.status;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("No user found!");
        error.statusCode = 404;
        throw error;
      }
      user.status = newStatus;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Status updated successfully" });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

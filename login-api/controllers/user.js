const User = require("../models/user");
const Post = require("../models/post");
exports.getUserDetail = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      console.log(user);
      res.status(200).json({ detail: user });
    })
    .catch((err) => console.log(err));
};

exports.createPost = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  console.log(title, description);
  let creator;
  const post = new Post({
    title: title,
    description: description,
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      console.log(res);
      console.log("post created successfully");
      return res.status(200).json({ post: post });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res
        .status(200)
        .json({ message: "Posts fetched sucessfully", data: posts });
    })
    .catch((err) => {
      console.log(err);
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
  const updatedTitle = req.body.title;
  const updatedDescription = req.body.description;
  console.log(postId);
  Post.findById(postId)
    .then((post) => {
      if (post.creator.toString() !== postId) {
        console.log("Not Authorized");
      }
      post.title = updatedTitle;
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
        console.log("no post found");
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
      console.log("deleted Successfully");
      res.status(200).json({ message: "deleted" });
    })
    .catch((err) => {
      console.log(err);
    });
};

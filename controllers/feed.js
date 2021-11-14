const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator");

// Import models
const Post = require("../models/post");
const User = require("../models/auth");

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const itemPerPage = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * itemPerPage)
        .limit(itemPerPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Fetched all posts successfully",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createPost = (req, res, next) => {
  const error = validationResult(req);
  const title = req.body.title;
  const content = req.body.content;
  const image = req.file;

  if (!error.isEmpty()) {
    const err = new Error("Input validation failed");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }

  if (!image) {
    const err = new Error(
      "No file or Attached file is not an image (jpeg/jpg/png)"
    );
    err.statusCode = 422;
    throw err;
  }

  let activeUser, savePost;

  User.findById(req.userId)
    .then((user) => {
      activeUser = user;
      const post = new Post({
        title: title,
        content: content,
        creator: {
          name: user.name,
          userId: req.userId,
        },
        imageUrl: "images/" + image.filename,
      });
      return post.save();
    })
    .then((post) => {
      savePost = post;
      activeUser.posts.push(post);
      return activeUser.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created successfully!",
        post: savePost,
        creator: {
          _id: result._id,
          name: result.name,
        },
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
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: "Data found",
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

exports.updatePost = (req, res, next) => {
  const error = validationResult(req);
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let image = req.body.image;

  if (!error.isEmpty()) {
    const err = new Error("Input validation failed");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }

  if (req.file) {
    image = "images/" + req.file.filename;
  }

  if (!image) {
    const err = new Error("No image uploaded");
    err.statusCode = 422;
    throw err;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const err = new Error("No post found");
        err.statusCode = 422;
        throw err;
      }

      if (req.userId.toString() !== post.creator.userId.toString()) {
        const err = new Error("Not authorized");
        err.statusCode = 401;
        throw err;
      }

      if (image !== post.imageUrl) {
        deleteFile(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = image;
      post.content = content;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "Post updated",
        post: result,
      });
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
  let imageUrl;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No post found");
        error.statusCode = 422;
        throw err;
      }

      if (req.userId.toString() !== post.creator.userId.toString()) {
        const err = new Error("Not authorized");
        err.statusCode = 401;
        throw err;
      }
      imageUrl = post.imageUrl;
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      deleteFile(imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      res.status(200).json({
        message: "File deleted",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const deleteFile = (file) => {
  const filePath = path.join(__dirname, "..", file);
  fs.unlink(filePath, (err) => {
    if (err) console.log(err);
  });
};

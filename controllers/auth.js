const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv')

dotenv.config()

const User = require("../models/auth");

exports.signup = (req, res, next) => {
  const error = validationResult(req);
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  if (!error.isEmpty()) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }

  bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email: email,
        password: hashPassword,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(200).json({
        message: "User created",
        data: result._id,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const error = validationResult(req)
  const email = req.body.email;
  const password = req.body.password;
  let fetchedUser;

  if (!error.isEmpty()) {
    const err = new Error("Validation failed");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("Invalid email");
        error.statusCode = 401;
        throw error;
      }

      fetchedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Invalid password");
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        token: token,
        userId: fetchedUser._id.toString(),
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.getStatus = (req, res, next) => {
  const userId = req.userId;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }


      res.status(200).json({
        status: user.status,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateStatus = (req, res, next) => {
  const error = validationResult(req)
  const userId = req.userId
  const status = req.body.status

  if (!error.isEmpty()) {
    const err = new Error("Status validation failed");
    err.statusCode = 422;
    err.data = error.array();
    throw err;
  }

  User.findById(userId)
  .then(user => {
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    user.status = status
    return user.save()
  })
  .then(result => {
    res.status(200).json({
      message: "Status updated"
    })
  })
  .catch((err) => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
}
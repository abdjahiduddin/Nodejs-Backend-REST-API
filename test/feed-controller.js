const { expect } = require("chai");
const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const FeedController = require("../controllers/feed");
const User = require("../models/auth");
const Post = require("../models/post");
const io = require("../socket")

const MONGODB_URI =
  "mongodb+srv://node_user:toor@freecodecamp.yulo9.mongodb.net/test-messages?retryWrites=true&w=majority";

describe("Feed Controllers", function () {
  before(function (done) {
    mongoose
      .connect(MONGODB_URI)
      .then((connect) => {
        const user = new User({
          email: "user@example.com",
          password: "password",
          name: "user",
          posts: [],
          _id: "619abaeb8100b8ba2fd9eabc",
        });

        return user.save();
      })
      .then((result) => {
        done();
      })
      .catch(done);
  });

  // Run every before and after test cases
  // beforeEach(function () {});
  // afterEach(function () {});

  it("should created a new post", function (done) {
    const req = {
      userId: "619abaeb8100b8ba2fd9eabc",
      body: {
        title: "Test title",
        content: "Test content",
      },
      file: {
        filename: "test",
      },
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };

    sinon.stub(io, 'getIO').returns({
      emit: sinon.stub().returns({})
    })

    FeedController.createPost(req, res, () => {})
      .then((result) => {
        expect(result).to.have.property("posts");
        expect(result.posts).to.have.length(1);
        done();
      })
      .catch(done);
  });

  after(function (done) {
    User.deleteMany({})
      .then((result) => {
        return Post.deleteMany({});
      })
      .then((result) => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch(done);
  });
});

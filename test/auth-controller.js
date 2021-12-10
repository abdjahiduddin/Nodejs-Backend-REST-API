const { expect } = require("chai");
const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const AuthController = require("../controllers/auth");
const User = require("../models/auth");

const MONGODB_URI =
  "mongodb+srv://node_user:toor@freecodecamp.yulo9.mongodb.net/test-messages?retryWrites=true&w=majority";

describe("Auth Controllers", function () {
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

  it("should throw an error with code 500 if accessing databases fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "user@example.com",
        password: "password",
      },
    };

    AuthController.login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      })
      .catch(done);

    User.findOne.restore();
  });

  it("should send a response with user status", function (done) {
    const req = {
      userId: "619abaeb8100b8ba2fd9eabc",
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;
        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
        // return this;
      },
    };

    AuthController.getStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.equal(200);
        expect(res.userStatus).to.equal("I am new");
        done();
      })
      .catch(done);
  });

  after(function (done) {
    User.deleteMany({})
      .then((result) => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      })
      .catch(done);
  });
});

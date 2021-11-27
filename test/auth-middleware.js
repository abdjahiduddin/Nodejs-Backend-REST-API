const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleware = require("../middleware/is-auth");

describe("Auth middleware", function () {
  it("should return a error if no authorization header is present", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authorized"
    );
  });

  it("should have userId after decoding the token", function () {
    const req = {
      get: function (headerName) {
        return "Bearer xyzsadsadsa";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    jwt.verify.restore();
  });

  it("check if jwt verify is called", function () {
    const req = {
      get: function (headerName) {
        return "Bearer aijdiwojiwodqw";
      },
    };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});
    expect(jwt.verify.called).to.true;
    jwt.verify.restore();
  });

  it("should return a error if authorization header is only a string", function () {
    const req = {
      get: function (headerName) {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });
});

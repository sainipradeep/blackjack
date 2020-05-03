let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
chai.use(chaiHttp);
let server = require("./../app/app");

module.exports = {
  chai,
  server
}

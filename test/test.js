process.env.NODE_ENV = 'test';

var assert = require("assert");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("./../app/app");
let should = chai.should();
chai.use(chaiHttp);

const {
  initGame
} = require('./game');

const {
  initTable,
  joinTable,
  createTables,
  getTables
} = require('./table');

const {
  initUser,
  login
} = require('./user');

describe("Tasks", () => {
  describe("Clear All", () => {
    it("should remove all data first", async () => {
      console.log("Deleting all data in db first.")
      await initGame()
      await initTable()
      await initUser()
    })
  })
  describe("LOGIN OR SIGNUP", () => {
    it("login or signup", async () => {
      let r1 = await login();
      let r2 = await createTables();
      let r3 = await getTables();
      r3['tables'].should.have.length(3);
      let r4 = await joinTable(r3, r1)

    })
  })

})

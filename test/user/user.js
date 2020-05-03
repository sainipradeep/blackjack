const {
  chai,
  server
} = require('../chai');

async function removeUsers() {
  new Promise((resolve, reject) => {
    chai.request(server)
      .delete("/api/auth")
      .send({})
      .end((err, res) => {
        res.should.have.status(200);
        resolve(res.body)
      })
  })
}

async function login() {
  let user = {
    "phoneNumber": "9222222222",
    "playerName": "pradeep",
  }
  return new Promise((resolve, reject) => {
    chai.request(server)
      .post("/api/auth/login")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        resolve(res.body)
      })
  })
}

module.exports = {
  removeUsers,
  login
}

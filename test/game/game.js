const {
  chai,
  server
} = require('../chai');

async function removeGames() {
  new Promise((resolve, reject) => {
    chai.request(server)
      .delete("/api/game")
      .send({})
      .end((err, res) => {
        res.should.have.status(200);
        resolve(res.body)
      })
  })
}


module.exports = {
  removeGames
}

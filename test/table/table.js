const {chai,
server} = require('../chai');
async function removeTables() {
  new Promise((resolve, reject) => {
    chai.request(server)
      .delete("/api/table")
      .send({})
      .end((err, res) => {
        res.should.have.status(200);
        resolve(res.body)
      })
  })
}

async function joinTable(tables, user) {
  let obj = {
    "tableId": tables['tables'][0]._id,
    "playerId": user['player']._id
  }
  return new Promise((resolve, reject) => {
    chai.request(server)
      .post("/api/table/joinTable")
      .send(obj)
      .end((err, res) => {
        console.log(res.body);
        res.should.have.status(200);
        resolve(res.body)
      })
  })
}



async function createTables() {
  let obj = [{
      "table_number": 1,
      "dealer_name": "Ashish",
      "intial_coin": 40,
      "game_start": false,
      "joined_players": []
    },
    {
      "table_number": 2,
      "dealer_name": "Aman",
      "intial_coin": 50,
      "game_start": false,
      "joined_players": []
    }, {
      "table_number": 3,
      "dealer_name": "Pradeep",
      "intial_coin": 100,
      "game_start": false,
      "joined_players": []
    }
  ]

  return new Promise((resolve, reject) => {
    chai.request(server)
      .post("/api/table/createTables")
      .send(obj)
      .end((err, res) => {
        res.should.have.status(200);
        resolve(res.body)
      })
  })
}

async function getTables() {
  return new Promise((resolve, reject) => {
    chai.request(server)
      .get("/api/table/viewTables")
      .send({})
      .end((err, res) => {
        res.should.have.status(200);
        resolve(res.body)
      })
  })
}

module.exports = {
  removeTables,
  joinTable,
  createTables,
  getTables
}

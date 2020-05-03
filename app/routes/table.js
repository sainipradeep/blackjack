// viewTables
// joinTable
// leaveTable

// {
//   table_number: 1,
//   dealer_name: "pradeep",
//   dealer: {},
//   players: {
//     1: {
//       "name": "Edmond",
//       "bet": 10,
//       "hand": [{
//           "suit": "spades",
//           "rank": "Queen",
//           "value": 10
//         },
//         {
//           "suit": "spades",
//           "rank": "2",
//           "value": 2
//         }
//       ],
//       "done": false
//     },
//     2: {}
//   },
//   intial_coin: 50
//   game_start: true,
//   joined_players["1", "2"]
// }

const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID
const is = require('is2');
const database = require('./../config/mongo');

router.get('/viewTables', async (req, res) => {
  try {
    let db = await database.getInstance()
    let tables = await db.collection('tables').find({}).toArray()
    res.status(200).json({
      success: true,
      tables: tables
    })
    return
  } catch (e) {
    console.error(e);
    res.status(400).json({
      success: false,
      error: e.message,
      stack: e.stack
    })
    return
  }
})


router.delete('/', async (req, res) => {
  try {
    let db = await database.getInstance()
    let tables = await db.collection('tables').deleteMany({})
    res.status(200).json({
      success: true,
      tables: tables
    })
    return
  } catch (e) {
    console.error(e);
    res.status(400).json({
      success: false,
      error: e.message,
      stack: e.stack
    })
    return
  }
})

router.post('/joinTable', async (req, res) => {
  try {
    let json = req.body;

    console.log("json", json);

    if (!is.nonEmptyStr(json.playerId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid playerId field: ' + json.playerId
      });
      return;
    }

    if (!is.nonEmptyStr(json.tableId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid tableId field: ' + json.tableId
      });
      return;
    }

    let db = await database.getInstance()


    let table = await db.collection('tables').findOne({
      _id: new ObjectID(json.tableId)
    })

    let status = isValidTable(table, json)
    if (status !== true) {
      res.status(400).json({
        success: false,
        error: status + json.tableId
      })
      return
    }

    if (table.game_start == true) {
      res.status(400).json({
        success: false,
        error: "Game started Please join after game end"
      })
      return
    }


    let userObj = await db.collection('users').findOne({
      _id: new ObjectID(json.playerId)
    });

    if (!userObj) {
      res.status(400).json({
        success: false,
        error: 'Invalid playerId field: ' + json.playerId
      });
      return;
    }

    if (userObj.coin < table.intial_coin) {
      res.status(400).json({
        success: false,
        error: 'You dont have valid amount'
      });
      return;
    }


    await db.collection('tables').updateOne({
      _id: new ObjectID(json.tableId)
    }, {
      $set: {
        [`players.${json.playerId}`]: {
          "playerName": userObj.playerName,
          "bet": -1,
          "hand": [],
          "done": false
        }
      },
      $push: {
        joined_players: json.playerId
      },
      $inc: {
        numPlayers: 1
      }
    });


    let tableUpdatedData = await db.collection('tables').findOne({
      _id: new ObjectID(json.tableId)
    })

    res.status(200).json({
      success: true,
      table: tableUpdatedData
    })

    return
  } catch (e) {
    console.error(e);
    res.status(400).json({
      success: false,
      error: e.message,
      stack: e.stack
    })
    return
  }
})

function isValidTable(table, json) {

  if (!table) {
    return "Table not found: "
  }
  if (table.joined_players && table.joined_players.indexOf(json.playerId) > -1) {
    return "Already joined: "
  }
  if (table.joined_players && table.joined_players.indexOf(json.playerId) < 0 && table.joined_players.length > 4) {
    return "Table full now: "
  }

  return true
}

router.post('/leaveTable', async (req, res) => {

})
router.post('/createTables', async (req, res) => {
  try {
    let db = await database.getInstance()
    let tables = await db.collection('tables').insertMany(req.body)
    res.status(200).json({
      success: true,
      tables: tables
    })
    return
  } catch (e) {
    console.error(e);
    res.status(400).json({
      success: false,
      error: e.message,
      stack: e.stack
    })
    return
  }
})


module.exports = router

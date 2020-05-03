const express = require('express');
const router = express.Router();
const is = require('is2');
const database = require('./../config/mongo');

router.post('/login', async (req, res) => {
  let json = req.body;
  if (!is.nonEmptyStr(json.playerName)) {
    res.status(400).json({
      success: false,
      error: 'Invalid name field: ' + json.playerName
    });
    return;
  }

  if (!is.phoneNumber(json.phoneNumber)) {
    res.status(400).json({
      success: false,
      error: 'Invalid phoneNumber field: ' + json.phoneNumber
    });
    return;
  }

  json.playerName = json.playerName.toLowerCase();

  let data = {}
  try {
    let db = await database.getInstance()
    // console.log(db);
    let userCollection = db.collection('users');
    let isUserExists = await userCollection.count({
      phoneNumber: json.phoneNumber
    });
    if (isUserExists) {
      let userObj = await userCollection.findOne({
        phoneNumber: json.phoneNumber
      }, {
        phoneNumber: 1,
        playerName: 1
      });
      data = {
        success: true,
        player: userObj
      };
    } else {
      let userObj = await userCollection.insertOne(Object.assign(json, {
        coin: 500,
        created_date: new Date(),
        updated_date: new Date()
      }))
      data = {
        success: true,
        player: userObj['ops'][0]
      };
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({
      success: false,
      error: e.message,
      stack: e.stack
    })
    return
  }
  res.status(200).json(data)
})

router.delete('/', async (req, res) => {
  try {
    let db = await database.getInstance()
    let result = await db.collection('users').deleteMany({})
    res.status(400).status(200).json({
      success: true,
      tables: result
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

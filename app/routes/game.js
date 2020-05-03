const express = require('express');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID
const is = require('is2');
const database = require('./../config/mongo');

router.delete('/', async (req, res) => {
  try {
    let db = await database.getInstance()
    let games = await db.collection('games').deleteMany({})
    res.status(400).status(200).json({
      success: true,
      tables: games
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
